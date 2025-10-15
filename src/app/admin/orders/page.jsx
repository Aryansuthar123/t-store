"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
     const [isDeleting, setIsDeleting] = useState(false); 

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
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-left mb-6">Orders List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                    <thead>
                        <tr className="text-left bg-gray-100">
                            <th className="p-3">Sr No</th>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Details</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{order._id}</td>
                                <td className="p-3">{order.address.fullName}</td>
                                <td className="p-3">₹{order.totalAmount}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm ${order.orderStatus === "Delivered"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}  >
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => alert(`Viewing details for Order ID: ${order._id}`)}
                                        className="text-blue-600 hover:underline" >
                                        View
                                    </button>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                    
                                        disabled={isDeleting}
                                        
                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
