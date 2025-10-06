'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CheckoutPage() {
    const [product, setProduct] = useState(null);
    const [orderDate, setOrderDate] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [preview, setPreview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressSaved, setAddressSaved] = useState(false);

    const [address, setAddress] = useState({
        fullName: "",
        mobile: "",
        pincode: "",
        flat: "",
        area: "",
    });

    useEffect(() => {
        const stored = localStorage.getItem("checkoutProduct");
        if (stored) {
            const parsed = JSON.parse(stored);
            console.log("Loaded product:", parsed);
            setProduct(parsed);

            const today = new Date();
            const delivery = new Date();
            delivery.setDate(today.getDate() + 6);

            const options = { year: "numeric", month: "long", day: "numeric" };
            setOrderDate(today.toLocaleDateString("en-IN", options));
            setDeliveryDate(delivery.toLocaleDateString("en-IN", options));
        }
    }, []);


    if (!product) {
        return <p className="text-center mt-10">No product found for payment</p>;
    }
    const featureImage = product.featureImage || "/placeholder.jpg";
    const images = product.images || [];


    const handleSaveAddress = () => {
        if (
            address.fullName &&
            address.mobile &&
            address.pincode &&
            address.flat &&
            address.area
        ) {
            setAddressSaved(true);
            setIsModalOpen(false);
        } else {
            alert("Please fill all address fields.");
        }
    };

    return (
        <div className="max-w-7xl px-0 mx-auto p-9">
            <h1 className="text-left font-bold  rounded-lg text-black">Checkout
                <b className="text-pink-500">.</b></h1>
            <h1 className="text-2xl font-bold mb-6">Address </h1>
            <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/2 flex flex-col gap-4">

                    {!addressSaved ? (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
                            Add Delivery Address
                        </button>
                    ) : (
                        <div className="border p-4 rounded bg-gray-100">
                            <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
                            <p><b>Name:</b> {address.fullName}</p>
                            <p><b>Mobile:</b> {address.mobile}</p>
                            <p><b>Address:</b> {address.flat}, {address.area}</p>
                            <p><b>Pincode:</b> {address.pincode}</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-3 text-blue-600 underline">
                                Edit Address
                            </button>
                        </div>
                    )}

                    <div className="border p-4  rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Choose Payment Method</h2>
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="payment" defaultChecked /> UPI / Wallet
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="payment" /> Credit / Debit Card
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="payment" /> Cash on Delivery (COD)
                            </label>
                        </div>

                        <button className="mt-6 bg-green-600 text-white px-7 py-2 rounded-lg hover:bg-green-700">
                            Pay Now
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 flex flex-col bg-pink-100 items-center border p-4 rounded-lg">
                    <div className="flex gap-4">

                        <div className="flex flex-col gap-2">
                            {[featureImage, ...images].map((img, i) => (
                                <button key={i} onClick={() => setPreview(img)}>
                                    <Image
                                        src={img}
                                        alt={`thumb-${i}`}
                                        width={60}
                                        height={60}
                                        className={`object-cover rounded border hover:scale-105 transition 
                                            ${(preview || featureImage) === img ? "ring-2 ring-blue-500" : ""}`}
                                    />
                                </button>
                            ))}
                        </div>

                        <Image
                            src={preview || featureImage}
                            alt={product.title}
                            width={200}
                            height={200}
                            className="object-cover rounded-lg shadow-md "
                        />
                    </div>
                    <div className="mt-6 text-center">
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
                       
                        <p className="mt-2 text-gray-700">Order Date: <b>{orderDate}</b></p>
                        <p className="text-gray-700">Estimated Delivery: <b>{deliveryDate}</b></p>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[90%] md:w-[500px] relative">
                        <button
                            className="absolute top-3 right-4 text-2xl font-bold"
                            onClick={() => setIsModalOpen(false)} >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Enter Delivery Address</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="border p-2 rounded"
                                value={address.fullName}
                                onChange={(e) =>
                                    setAddress({ ...address, fullName: e.target.value })
                                } />
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                className="border p-2 rounded"
                                value={address.mobile}
                                onChange={(e) =>
                                    setAddress({ ...address, mobile: e.target.value })} />
                            <input
                                type="text"
                                placeholder="Pincode"
                                className="border p-2 rounded"
                                value={address.pincode}
                                onChange={(e) =>
                                    setAddress({ ...address, pincode: e.target.value })} />
                            <input
                                type="text"
                                placeholder="Flat, House no., Building"
                                className="border p-2 rounded"
                                value={address.flat}
                                onChange={(e) =>
                                    setAddress({ ...address, flat: e.target.value })} />
                            <input
                                type="text"
                                placeholder="Area, Street, Sector, Village"
                                className="border p-2 rounded"
                                value={address.area}
                                onChange={(e) =>
                                    setAddress({ ...address, area: e.target.value })} />

                            <button
                                onClick={handleSaveAddress}
                                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                Save Address
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
