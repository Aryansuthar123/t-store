'use client';
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const [product, setProduct] = useState(null);

    useEffect(() => {
    const stored = localStorage.getItem("checkoutProduct");
    if (stored) {
        console.log("Checkout Product:", JSON.parse(stored)); 
        setProduct(JSON.parse(stored));
    }
}, []);


    if (!product) {
        return <p className="text-center mt-10">No product selected for checkout</p>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <div className="flex gap-20 py-6 px-10  border p-8 rounded-lg shadow">
                <img src={product.imgSrc} alt={product.title} className="w-4- h-40 object-cover rounded" />

                <div>
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    {product.salePrice ? (
                        <p className="text-gray-700">
                            <span className="line-through mr-2">₹{product.price}</span>
                            <span className="font-bold text-green-700">₹{product.salePrice}</span>
                        </p>
                    ) : (
                        <p className="text-gray-950">₹{product.price}</p>
                    )}
                    <p>Quantity: {product.quantity}</p>
                    <p className="font-bold mt-2">
                        Total: ₹{(parseFloat(product.salePrice ?? product.price) || 0) * (product.quantity || 1)}
                    </p>
                </div>  
            </div>

            <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">
                Proceed to Payment
            </button>
        </div>
    );
}
