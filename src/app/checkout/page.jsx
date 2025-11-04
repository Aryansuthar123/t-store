"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [addressSaved, setAddressSaved] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    flat: "",
    area: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // ✅ Load product and address when page opens
  useEffect(() => {
    const storedProduct = localStorage.getItem("checkoutProduct");
    if (storedProduct) {
      const parsed = JSON.parse(storedProduct);
      setProduct(parsed);

      const today = new Date();
      const delivery = new Date();
      delivery.setDate(today.getDate() + 6);

      const options = { year: "numeric", month: "long", day: "numeric" };
      setOrderDate(today.toLocaleDateString("en-IN", options));
      setDeliveryDate(delivery.toLocaleDateString("en-IN", options));
    }

    const savedAddress = localStorage.getItem("userAddress");
    const savedUser = localStorage.getItem("user");
    if (savedAddress && savedUser) {
      const parsed = JSON.parse(savedAddress);
      const user = JSON.parse(savedUser);
      setAddress({ ...parsed, email: user.email });
      setAddressSaved(true);
    }
  }, []);

  // ✅ Save address function
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
      alert("Address saved successfully!");
    } else {
      alert("Please fill all address fields.");
    }
  };

  // ✅ Payment/Buy Now click handler
  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // 🔒 Check if user logged in
    if (!token || !user) {
      // Not logged in → Save product and redirect to login
      localStorage.setItem("checkoutProduct", JSON.stringify(product));
      router.push("/login?redirect=/checkout");
      return;
    }

    // If logged in → proceed to order
    const userData = JSON.parse(user);

    if (!addressSaved) {
      alert("Please add your delivery address before payment!");
      return;
    }

    const totalAmount =
      (parseFloat(product?.salePrice ?? product?.price) || 0) *
      (product?.quantity || 1);

    if (selectedPaymentMethod === "cod") {
      setLoading(true);
      try {
        const orderData = {
          product,
          address: { ...address, email: userData.email },
          totalAmount,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Pending",
          orderDate,
          deliveryDate,
          userEmail: userData.email,
        };

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const result = await res.json();
        if (result.success && result.order?._id) {
          localStorage.setItem("lastOrderId", result.order._id);
          router.push("/order-success");
        } else {
          throw new Error(result.error || "Order save failed");
        }
      } catch (err) {
        console.error("Order Error:", err);
        alert("Something went wrong while placing the order.");
      } finally {
        setLoading(false);
      }
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  // ✅ Card validation and payment submit
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

  const handleMockPaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const rawCard = cardNumber.replace(/\s+/g, "");

    if (!luhnCheck(rawCard)) {
      setPaymentError("Invalid card number.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setPaymentError("Expiry must be MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cardCvv)) {
      setPaymentError("CVV must be 3 or 4 digits.");
      return;
    }

    setPaymentProcessing(true);
    try {
      const totalAmount =
        (parseFloat(product?.salePrice ?? product?.price) || 0) *
        (product?.quantity || 1);

      const orderData = {
        product,
        address: { ...address, email: user.email },
        totalAmount,
        paymentMethod: "Mock-Card",
        paymentStatus: "Paid",
        orderDate,
        deliveryDate,
        userEmail: user.email,
        mockPayment: {
          cardLast4: rawCard.slice(-4),
          cardBrand: detectCardBrand(rawCard),
          simulatedTransactionId: "mock_txn_" + Date.now(),
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (result.success && result.order?._id) {
        localStorage.setItem("lastOrderId", result.order._id);
        setIsPaymentModalOpen(false);
        router.push("/order-success");
      } else {
        throw new Error(result.error || "Order save failed");
      }
    } catch (err) {
      console.error("Mock payment/order error:", err);
      setPaymentError("Something went wrong while placing the order.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (!product)
    return <p className="text-center mt-10">No product found for checkout.</p>;

  const featureImage = product?.featureImage ?? "/placeholder.jpg";
  const images = Array.isArray(product?.images) ? product.images : [];

  // ✅ Page UI
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Info */}
        <div className="border rounded-lg p-4">
          <img
            src={featureImage}
            alt={product?.name}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold">{product?.name}</h2>
          <p className="text-gray-700">
            ₹
            {product?.salePrice
              ? product.salePrice
              : product?.price?.toFixed(2)}
          </p>
          <p>Quantity: {product?.quantity || 1}</p>
          <p>Order Date: {orderDate}</p>
          <p>Expected Delivery: {deliveryDate}</p>
        </div>

        {/* Address and Payment */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>

          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full rounded"
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Mobile"
            className="border p-2 w-full rounded"
            value={address.mobile}
            onChange={(e) =>
              setAddress({ ...address, mobile: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Pincode"
            className="border p-2 w-full rounded"
            value={address.pincode}
            onChange={(e) =>
              setAddress({ ...address, pincode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Flat, House no."
            className="border p-2 w-full rounded"
            value={address.flat}
            onChange={(e) => setAddress({ ...address, flat: e.target.value })}
          />
          <input
            type="text"
            placeholder="Area, Colony"
            className="border p-2 w-full rounded"
            value={address.area}
            onChange={(e) => setAddress({ ...address, area: e.target.value })}
          />

          <button
            onClick={handleSaveAddress}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Save Address
          </button>

          <h2 className="text-xl font-semibold mt-4">Payment Method</h2>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={selectedPaymentMethod === "cod"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />{" "}
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={selectedPaymentMethod === "card"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />{" "}
              Card
            </label>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-3 rounded-md hover:bg-blue-700 mt-4"
          >
            {loading ? "Placing Order..." : "Buy Now"}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Mock Payment</h2>
            <form onSubmit={handleMockPaymentSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                className="border p-2 w-full rounded"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Name on Card"
                className="border p-2 w-full rounded"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
              <input
                type="text"
                placeholder="MM/YY"
                className="border p-2 w-full rounded"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
              />
              <input
                type="text"
                placeholder="CVV"
                className="border p-2 w-full rounded"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
              />
              {paymentError && (
                <p className="text-red-600 text-sm">{paymentError}</p>
              )}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {paymentProcessing ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
