"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState({});
  const router = useRouter();

  const fetchCartItems = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) setCartItems(data.cartItems);
    } catch (err) {
      console.error("Failed to fetch cart items", err);
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
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id, quantity: newQty }),
      });
      const data = await res.json();
      if (data.success) fetchCartItems();
    } catch (err) {
      console.error("Quantity update failed", err);
    }
  };

  const handleBuyNow = (item) => {
    localStorage.setItem("checkoutProduct", JSON.stringify(item));
    router.push(`/checkout?product_id=${item._id}`);
  };

  const handleRemoveItem = async (_id) => {
    try {
      const res = await fetch(`/api/cart?_id=${_id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) => prev.filter((it) => it._id !== _id));
      }
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart…</p>;
  if (cartItems.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <ul className="space-y-6">
        {cartItems.map((item) => {
          const feature =
            item.featureImage && item.featureImage !== "undefined"
              ? item.featureImage
              : item.images?.[0] || item.imgSrc || "/placeholder.jpg";

          const currentPreview =
            item?._id && previews[item._id] ? previews[item._id] : feature;

          const allImages = [
            feature,
            ...(item.images?.filter(Boolean) || []),
          ].filter((img, index, self) => self.indexOf(img) === index);

          return (
            <li
              key={item._id}
              className="flex flex-wrap md:flex-nowrap gap-6 p-6 border rounded-xl shadow bg-white"
            >
             
              <div className="flex flex-col gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setPreviews((p) => ({ ...p, [item._id]: img }))
                    }
                  >
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="w-16 h-16 object-cover rounded border hover:scale-105 transition"
                    />
                  </button>
                ))}
              </div>

            
              <img
                src={currentPreview}
                alt={item.title}
                className="w-44 h-44 object-cover rounded-lg shadow"
              />

            
              <div className="flex-1 min-w-[250px]">
                <h2 className="text-xl font-semibold">{item.title}</h2>

                {item.salePrice ? (
                  <p className="text-gray-700 mt-1">
                    <span className="line-through mr-2">₹{item.price}</span>
                    <span className="font-bold text-green-700">
                      ₹{item.salePrice}
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-700 mt-1">₹{item.price}</p>
                )}

                {item.description && (
                  <div
                    className="text-sm text-gray-600 mt-1"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}

               
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>

                  <p className="ml-3 font-medium flex p-2 text-green-400">
                    Total: ₹
                    {(parseFloat(item.salePrice ?? item.price) || 0) *
                      (item.quantity || 1)}
                  </p>

                  <button
                    onClick={() => handleBuyNow(item)}
                    className="ml-4 bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
