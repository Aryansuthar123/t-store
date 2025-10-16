"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [orderDate, setOrderDate] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [preview, setPreview] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressSaved, setAddressSaved] = useState(false);
    const [address, setAddress] = useState({
        fullName: "",
        mobile: "",
        pincode: "",
        flat: "",
        area: "",
    });

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("checkoutProduct");
            if (stored) {
                const parsed = JSON.parse(stored);
                setProduct(parsed);

                const today = new Date();
                const delivery = new Date();
                delivery.setDate(today.getDate() + 6);

                const options = { year: "numeric", month: "long", day: "numeric" };
                setOrderDate(today.toLocaleDateString("en-IN", options));
                setDeliveryDate(delivery.toLocaleDateString("en-IN", options));
            }

            const savedAddress = localStorage.getItem("userAddress");
            if (savedAddress) {
                const parsed = JSON.parse(savedAddress);
                setAddress(parsed);
                setAddressSaved(true);
            }
        } catch (err) {
            console.error("Error loading data:", err);
        }
    }, []);

    const luhnCheck = (num) => {
        const s = num.replace(/\s+/g, "");
        if (!/^\d+$/.test(s)) return false;
        let sum = 0;
        let shouldDouble = false;
        for (let i = s.length - 1; i >= 0; i--) {
            let d = parseInt(s.charAt(i), 10);
            if (shouldDouble) {
                d *= 2;
                if (d > 9) d -= 9;
            }
            sum += d;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    };

    const detectCardBrand = (num) => {
        if (/^4/.test(num)) return "Visa";
        if (/^5[1-5]/.test(num)) return "Mastercard";
        if (/^3[47]/.test(num)) return "American Express";
        if (/^6/.test(num)) return "Discover";
        return "Card";
    };

    const handleSaveAddress = () => {
        if (
            address.fullName &&
            address.mobile &&
            address.pincode &&
            address.flat &&
            address.area
        ) {
            localStorage.setItem("userAddress", JSON.stringify(address));
            setAddressSaved(true);
            setIsAddressModalOpen(false);
        } else {
            alert("Please fill all address fields.");
        }
    };

    const openPaymentModal = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login?redirect=/checkout");
            return;
        }

        if (!addressSaved) {
            alert("Please add your delivery address before payment!");
            return;
        }
        if (selectedPaymentMethod === "cod") {
            setLoading(true);
            try {
                const totalAmount =
                    (parseFloat(product?.salePrice ?? product?.price) || 0) *
                    (product?.quantity || 1);
                const orderData = {
                    product,
                    address,
                    totalAmount,
                    paymentMethod: "Cash on Delivery",
                    paymentStatus: "Pending",
                    orderDate,
                    deliveryDate,
                };

                const orderRes = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                });

                const orderResult = await orderRes.json();
                if (orderResult.success && orderResult.order?._id) {
                    localStorage.setItem("lastOrderId", orderResult.order._id);
                    router.push("/order-success");
                } else {
                    throw new Error(orderResult.error || "Order save failed");
                }
            } catch (err) {
                console.error("COD Order Error:", err);
                alert("Something went wrong while placing the order.");
            } finally {
                setLoading(false);
            }
        } else {
            setPaymentError(null);
            setIsPaymentModalOpen(true);
        }
    };
    const handleMockPaymentSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setPaymentError(null);

        const rawCard = cardNumber.replace(/\s+/g, "");
        if (rawCard.length < 12 || rawCard.length > 19 || !/^\d+$/.test(rawCard)) {
            setPaymentError("Please enter a valid card number.");
            return;
        }
        if (!luhnCheck(rawCard)) {
            setPaymentError("Invalid card number.");
            return; }
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            setPaymentError("Expiry must be in MM/YY format.");
            return;}
        if (!/^\d{3,4}$/.test(cardCvv)) {
            setPaymentError("CVV must be 3 or 4 digits.");
            return; }

        setPaymentProcessing(true);
        try {
            const totalAmount =
                (parseFloat(product?.salePrice ?? product?.price) || 0) *
                (product?.quantity || 1);

            const orderData = {
                product,
                address,
                totalAmount,
                paymentMethod: "Mock-Card",
                paymentStatus: "Paid",
                orderDate,
                deliveryDate,
                mockPayment: {
                    cardLast4: rawCard.slice(-4),
                    cardBrand: detectCardBrand(rawCard),
                    simulatedTransactionId: "mock_txn_" + Date.now(),
                },
            };

            const orderRes = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const orderResult = await orderRes.json();

            if (orderResult.success && orderResult.order?._id) {
                localStorage.setItem("lastOrderId", orderResult.order._id);
                setIsPaymentModalOpen(false);
                router.push("/order-success");
            } else {
                throw new Error(orderResult.error || "Order save failed");
            }
        } catch (err) {
            console.error("Mock payment/order error:", err);
            setPaymentError("Something went wrong while placing the order.");
        } finally {
            setPaymentProcessing(false);
        }
    };
    const featureImage = product?.featureImage ?? "/placeholder.jpg";
    const images = Array.isArray(product?.images) ? product.images : [];

    if (!product) {
        return <p className="text-center mt-10">No product found for payment</p>;
    }
    return (
        <div className="max-w-6xl px-2 mx-auto p-8">
            <h1 className="text-left font-bold text-black text-2xl mb-4">
                Checkout<b className="text-pink-500">.</b>
            </h1>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 flex flex-col gap-4">
                    <div className="border p-4 rounded bg-gray-100">
                        <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
                        {addressSaved ? (
                            <>
                                <p><b>Name:</b> {address.fullName}</p>
                                <p><b>Mobile:</b> {address.mobile}</p>
                                <p><b>Address:</b> {address.flat}, {address.area}</p>
                                <p><b>Pincode:</b> {address.pincode}</p>

                                <div className="flex gap-4 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="text-blue-600 underline">
                                        Edit Address  </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddress({
                                                fullName: "",
                                                mobile: "",
                                                pincode: "",
                                                flat: "",
                                                area: "",
                                            });
                                            setAddressSaved(false);
                                            setIsAddressModalOpen(true);
                                        }}
                                        className="text-green-600 underline" >
                                        Add New Address </button>
                                </div>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(true)}
                                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">  Add Delivery Address  </button>
                        )}
                    </div>
                    <div className="border p-3 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Choose Payment Method</h2>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={selectedPaymentMethod === "card"}
                                    onChange={() => setSelectedPaymentMethod("card")} />
                                {" "} Card / Wallet (Mock)
                            </label>
                            <label className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="netbanking"
                                    checked={selectedPaymentMethod === "netbanking"}
                                    onChange={() => setSelectedPaymentMethod("netbanking")}
                                    className="mr-3"  />
                                {" "}  Netbanking (Mock)
                            </label>
                            <label className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={selectedPaymentMethod === "cod"}
                                    onChange={() => setSelectedPaymentMethod("cod")}  />
                                {" "} Cash on Delivery (COD)
                            </label>
                        </div>
                        <div className="py-3">
                            <button
                                type="button"
                                onClick={openPaymentModal}
                                disabled={loading}
                                className="mt-6 bg-amber-500 text-white px-3 py-1 !rounded-lg hover:bg-amber-600 disabled:opacity-60"  >
                                {loading ? "Processing..." : "Pay Now"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/2 flex flex-col bg-gray-100 text-left border p-4 rounded-lg">
                    <div className="flex gap-4 items-start">
                        <div className="flex flex-col gap-2">
                            {[featureImage, ...images].filter(Boolean).map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setPreview(img)}
                                    className="p-0" >
                                    <img
                                        src={img}
                                        alt={`thumbnail ${i + 1}`}
                                        width={80}
                                        height={80}
                                        className={`object-cover rounded border hover:scale-105 transition ${(preview || featureImage) === img ? "ring-2 ring-blue-500" : ""
                                            }`} />
                                </button>
                            ))}
                        </div>
                        <div style={{ width: 300, height: 300 }} className="relative">
                            <img
                                src={preview || featureImage}
                                alt={product.title || "Product image"}
                                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                className="rounded-lg shadow-md"/>
                        </div>
                    </div>
                    <div className="mt-6 text-left">
                        <h2 className="text-xl font-semibold">{product.title}</h2>

                        {product.description && (
                            <div
                                className="text-gray-700 mt-2"
                                dangerouslySetInnerHTML={{ __html: product.description }} />
                        )}
                        <p>Price: ₹{product.salePrice ?? product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p className="font-bold mt-2">
                            Total: ₹
                            {(parseFloat(product.salePrice ?? product.price) || 0) *
                                (product.quantity || 1)}
                        </p>
                        <p className="mt-2 text-gray-700">  Order Date: <b>{orderDate}</b> </p>
                        <p className="text-gray-700">  Estimated Delivery: <b>{deliveryDate}</b></p>
                    </div>
                </div>
            </div>

            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[90%] md:w-[500px] relative">
                        <button
                            type="button"
                            className="absolute top-3 right-4 text-2xl font-bold"
                            onClick={() => setIsAddressModalOpen(false)} >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Enter Delivery Address</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="border p-2 rounded"
                                value={address.fullName}
                                onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                className="border p-2 rounded"
                                value={address.mobile}
                                onChange={(e) => setAddress({ ...address, mobile: e.target.value })} />
                            <input
                                type="text"
                                placeholder="Pincode"
                                className="border p-2 rounded"
                                value={address.pincode}
                                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}  />
                            <input
                                type="text"
                                placeholder="Flat, House no., Building"
                                className="border p-2 rounded"
                                value={address.flat}
                                onChange={(e) => setAddress({ ...address, flat: e.target.value })}/>
                            <input
                                type="text"
                                placeholder="Area, Street, Sector, Village"
                                className="border p-2 rounded"
                                value={address.area}
                                onChange={(e) => setAddress({ ...address, area: e.target.value })}/>
                            <button
                                type="button"
                                onClick={handleSaveAddress}
                                className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600"  >
                                Save Address
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-[480px] relative overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded flex items-center justify-center text-white font-bold">
                                    ₹
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Secure Payment</div>
                                    <div className="font-semibold">
                                        Pay ₹
                                        {(parseFloat(product.salePrice ?? product.price) || 0) *
                                            (product.quantity || 1)}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-xl px-3 "
                                onClick={() => setIsPaymentModalOpen(false)} >
                                ×
                            </button>
                        </div>
                        <form className="p-4" onSubmit={handleMockPaymentSubmit}>
                            <div className="mb-3">
                                <label className="text-sm text-gray-600 block">Card Number</label>
                                <input
                                    inputMode="numeric"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        let v = e.target.value.replace(/[^\d]/g, "");
                                        if (v.length > 19) v = v.slice(0, 19);
                                        const groups = v.match(/.{1,4}/g);
                                        setCardNumber(groups ? groups.join(" ") : v);
                                    }}
                                    placeholder="4111 1111 1111 1111"
                                    className="w-full border p-2 rounded mt-1"  />
                            </div>
                            <div className="flex gap-2 mb-3">
                                <div className="flex-1">
                                    <label className="text-sm text-gray-600 block">Expiry (MM/YY)</label>
                                    <input
                                        value={cardExpiry}
                                        onChange={(e) => {
                                            let v = e.target.value.replace(/[^\d]/g, "");
                                            if (v.length > 4) v = v.slice(0, 4);
                                            if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                                            setCardExpiry(v);
                                        }}
                                        placeholder="MM/YY"
                                        className="w-full border p-2 rounded mt-1"  />
                                </div>
                                <div className="w-32">
                                    <label className="text-sm text-gray-600 block">CVV</label>
                                    <input
                                        inputMode="numeric"
                                        value={cardCvv}
                                        onChange={(e) => {
                                            let v = e.target.value.replace(/[^\d]/g, "");
                                            if (v.length > 4) v = v.slice(0, 4);
                                            setCardCvv(v);
                                        }}
                                        placeholder="123"
                                        className="w-full border p-2 rounded mt-1"
                                        aria-label="CVV" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-sm text-gray-600 block">Name on Card</label>
                                <input
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="Full name"
                                    className="w-full border p-2 rounded mt-1"
                                    aria-label="Name on card" />
                            </div>

                            {paymentError && <div className="text-red-600 mb-2">{paymentError}</div>}

                            <div className="flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCardNumber("4111 1111 1111 1111");
                                        setCardExpiry("12/30");
                                        setCardCvv("123");
                                        setCardName(address.fullName || "Test User");
                                        setPaymentError(null);
                                    }}
                                    className="text-sm px-3 py-2 border rounded"
                                    aria-label="Use test card"> Use Test Card
                                </button>

                                <button
                                    type="submit"
                                    disabled={paymentProcessing}
                                    className="ml-auto bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 disabled:opacity-60"
                                    aria-label="Confirm payment"  >
                                    {paymentProcessing
                                        ? "Processing..."
                                        : "Pay ₹" +
                                        ((parseFloat(product.salePrice ?? product.price) || 0) *
                                            (product.quantity || 1))}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
