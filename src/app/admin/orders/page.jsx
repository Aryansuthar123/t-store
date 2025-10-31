"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== id));
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting.");
    }
    setIsDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-lg bg-gray-50 w-full ml-1 mt-1 p-2">
      <div className="bg-white rounded-xl shadow-md p-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left w-12">SN</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Order ID</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Customer</th>
                <th className="border border-gray-300 px-3 py-2 text-left w-24">Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-left w-32">Status</th>
                <th className="border border-gray-300 px-3 py-2 text-left w-24">Details</th>
                <th className="border border-gray-300 px-3 py-2 text-left w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-3 py-2">{order._id}</td>
                  <td className="border border-gray-300 px-3 py-2">{order.address?.fullName}</td>
                  <td className="border border-gray-300 px-3 py-2">₹{order.totalAmount}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={isDeleting}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white rounded-lg p-6 w-[55%] max-w-5xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Order Details
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 text-sm space-y-1">
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Customer:</strong> {selectedOrder.address?.fullName}</p>
                 <p><strong>Email:</strong> {selectedOrder.address?.email || selectedOrder.userEmail || "N/A"}</p>

                <p><strong>Phone:</strong> {selectedOrder.address?.mobile || selectedOrder.address?.phone}</p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedOrder.address?.flat}, {selectedOrder.address?.area},{" "}
                  {selectedOrder.address?.city}, {selectedOrder.address?.state} -{" "}
                  {selectedOrder.address?.pincode}
                </p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
                <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
                <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {preview && (
                  <div className="flex-shrink-0">
                    <Image
                      src={preview}
                      alt={selectedOrder.product?.title}
                      width={400}
                      height={350}
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {[selectedOrder.product?.featureImage, ...(selectedOrder.product?.images || [])]
                    .filter(Boolean)
                    .map((img, idx) => (
                      <button key={idx} onClick={() => setPreview(img)}>
                        <Image
                          src={img}
                          alt={`thumb-${idx}`}
                          width={80}
                          height={80}
                          className={`object-cover rounded border hover:scale-105 transition ${
                            preview === img ? "ring-2 ring-blue-500" : ""
                          }`}/>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
