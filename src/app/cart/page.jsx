'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const fetchCartItems = async () => {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            console.log("Cart items:", data.cartItems);
            if (data.success) {
                setCartItems(data.cartItems);
            }
        } catch (error) {
            console.error("Failed to fetch cart items", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);
    const updateQuantity = async (_id, newQty) => {
        if (newQty < 1) return;
        try {
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id, quantity: newQty }),
            });
            if (!res.ok) {
                const text = await res.text();
                console.error("Server Error:", text);
                return;
            }

            const data = await res.json();
            if (data.success) {
                fetchCartItems();
            } else {
                console.error("Update failed:", data.message);
            }
        } catch (error) {
            console.error("Quantity update failed", error);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading cart...</p>;

    if (cartItems.length === 0) {
        return <p className="text-center mt-10"> Your cart is empty.</p>;
    }

    const handleBuyNow = (item) => {
        router.push(`/checkout?product_id=${item._id}`);
    };

    const handleRemoveItem = async (_id) => {
        try {
            const res = await fetch(`/api/cart?_id=${_id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Delete failed:", text);
                return;
            }


            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Invalid JSON response from server.");
                return;
            }

            const data = await res.json();

            if (data.success) {
                setCartItems(prev => prev.filter(item => item._id !== _id));
                console.log("Item removed successfully.");
            } else {
                console.error("Failed to remove item:", data.message);
            }
        } catch (error) {
            console.error("Error removing item from cart", error);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 ">
            <h1 className="text-3xl font-bold mb-6 ">Your Cart</h1>
            <ul className="space-y-4 ">

                {cartItems.map((item) => (
                    <li key={item._id} className="flex items-center gap-4 p-4 border rounded-lg shadow">
                        <img src={item.imgSrc} alt={item.title} className="w-40 h-40 object-cover rounded" />

                        <div className="flex-1">
                            <h2 className="text-xl font-semibold ">{item.title}</h2>
                            <p className="text-gray-700">₹{item.price}</p>
                            {item.description && (
                                <div
                                    className="text-sm text-gray-500 mt-1"
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                />
                            )}

                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                                >− </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-300"
                                > + </button>

                                <p className="text-ml mt-2  text-black-600">
                                    Total: ₹{(parseFloat(item.price) || 0) * (item.quantity || 1)}
                                </p>
                                <button
                                    onClick={() => handleBuyNow(item)}
                                    className="ml-4 bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-600"
                                > Buy Now </button>
                                <button
                                    onClick={() => handleRemoveItem(item._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                                >  Remove </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
