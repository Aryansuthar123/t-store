"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const id = localStorage.getItem("lastOrderId");
        if (!id) {
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);

          const feat = data.order.product?.featureImage;
          const imgs = data.order.product?.images || [];
          setPreview(feat || imgs[0] || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastOrder();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 text-lg">Loading your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold text-red-500">No recent order found</h2>
        <p className="text-gray-600 mt-2">Please try placing an order again.</p>
      </div>
    );
  }

  const { product, totalAmount, paymentMethod, paymentStatus, orderDate, deliveryDate, address } = order;
  const images = product?.images || [];
  const featureImage = product?.featureImage;

  return (
    <div className="max-w-6xl gap-1 mx-auto p-8">

      <h1 className="text-3xl font-bold text-green-600">Order Successful!</h1>
      <p className="mt-3 text-lg text-gray-700">Thank you for shopping with us!</p>

      <div className="mt-6 border rounded-lg p-4 bg-gray-50 shadow flex flex-col  md:flex-row gap-6">
        
        <div className="flex-1 min-w-[180px]">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Order Summary</h2>
          <p><b>Product:</b> {product?.title}</p>
          <p><b>Quantity:</b> {product?.quantity ?? 1}</p>
          <p><b>Total Amount:</b> ₹{totalAmount}</p>
          <p><b>Payment Method:</b> {paymentMethod}</p>
          <p><b>Payment Status:</b> {paymentStatus}</p>
          <p><b>Order Date:</b> {orderDate}</p>
          <p><b>Delivery Date:</b> {deliveryDate}</p>
        </div>

        <div className="flex-shrink-0">
          {preview && (
            <Image
              src={preview}
              alt={product?.title}
              width={400}
              height={350}
              className="object-cover rounded-lg shadow-md" />
          )}
        </div>

  
        <div className="flex flex-col gap-2">
          {[featureImage, ...images].map((img, idx) => {
            if (!img) return null;
            return (
              <button key={idx} onClick={() => setPreview(img)}>
                <Image
                  src={img}
                  alt={`thumb-${idx}`}
                  width={80}
                  height={80}
                  className={`object-cover rounded border hover:scale-105 transition
                    ${preview === img ? "ring-2 ring-blue-500" : ""}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border rounded-lg p-4 bg-gray-50 shadow">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Delivery Address</h2>
        <p>{address.fullName}</p>
        <p>{address.flat}, {address.area}</p>
        <p>{address.pincode}</p>
        <p>{address.mobile}</p>
      </div>

     
    </div>
  );
}