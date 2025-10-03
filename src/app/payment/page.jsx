'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function PaymentPage() {
    const [product, setProduct] = useState(null);
     const [orderDate, setOrderDate] = useState("");
        const [deliveryDate, setDeliveryDate] = useState("");
        const [preview, setPreview] = useState(null);
        const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("checkoutProduct");
        if (stored) {
            setProduct(JSON.parse(stored));

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
    const featureImage = product.imgSrc || "/placeholder.jpg";
    const images = product.images || [];

   return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Payment</h1>

            <div className="border p-8 rounded-lg shadow flex flex-col md:flex-row gap-10">
    
                <div className="flex-1">
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <p>Price: ₹{product.salePrice ?? product.price}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p className="font-bold mt-2">
                        Total: ₹
                        {(parseFloat(product.salePrice ?? product.price) || 0) *
                            (product.quantity || 1)}
                    </p>
                    <p className="mt-2 text-gray-700">Order Date: <b>{orderDate}</b></p>
                    <p className="text-gray-700">Estimated Delivery: <b>{deliveryDate}</b></p>

                    <div className="mt-10">
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

                        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Pay Now
                        </button>
                    </div>
                </div>

              
                <div className="flex gap-4">
                   
                    <div className="flex flex-col gap-2">
                        {[featureImage, ...images].map((img, i) => (
                            <button key={i} onClick={() => setPreview(img)}>
                                <Image
                                    src={img}
                                    alt={`thumb-${i}`}
                                    width={70}
                                    height={70}
                                    className="object-cover rounded border hover:scale-105 transition"
                                />
                            </button>
                        ))}
                    </div>

                    
                    <Image
                        src={preview || featureImage}
                        alt={product.title}
                        width={500}
                        height={300}
                        className="object-cover rounded-lg shadow-md"
                    />
                </div>
            </div>

           
            {preview && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60">
                    <button
                        onClick={() => setPreview(null)}
                        className="absolute top-5 right-5 text-white text-3xl font-bold"  >
                        ×
                    </button>
                    <Image
                        src={preview}
                        alt="preview"
                        width={400}
                        height={400}
                        className="object-contain rounded-lg"
                    />
                </div>
            )}
        </div>
    );
}