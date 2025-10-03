

'use client';
import { useParams } from "next/navigation";
import { useProductContext } from "../../../context/ProductContext";
import Image from "next/image";
import { useCart } from '../../../context/CartContext';
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function ProductDetailsPage() {
    const { products } = useProductContext();
    const { product_id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [preview, setPreview] = useState(null);
    const { fetchCartItems } = useCart();


    const product = products.find((p) => p._id === product_id);

    const featureImage = product?.featureImage || "/placeholder.jpg";
    const images = product?.images || [];


    if (!product) {
        return <h1 className="text-center text-red-500 text-xl"> Product Not Found</h1>;
    }

   const handleAddToCart = async () => {
     setLoading(true); setMessage(""); 

    const cartItem = {
        _id: product._id,
        title: product.title,
        featureImage: product.featureImage || product.images?.[0] || "/placeholder.jpg",
        images: product.images || [],
        imgSrc: product.imgSrc || product.featureImage || product.images?.[0] || "/placeholder.jpg",
        price: product.price,
        salePrice: product.salePrice ?? null,
        description: product.description,
        quantity: quantity
        };

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartItem),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(" Product added to cart!");
                fetchCartItems();
            } else {
                toast.error("You already added this product to the cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            setMessage("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

const handleBuyNow = () => { 
    const checkoutProduct = { 
        id: product._id, title:
         product.title, 
         imgSrc:
  product.imgSrc ||
  product.featureImage ||
  product.images?.find(img => typeof img === "string" && img.startsWith("/uploads")) ||
  "",
        price: product.price, 
        salePrice: product.salePrice ?? null, 
        description: product.description, 
        quantity: quantity, };


        localStorage.setItem("checkoutProduct", JSON.stringify(checkoutProduct));
        router.push("/checkout");
    };
    return (
        <div className="flex justify-center py-10 bg-gray-70">
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-6 bg-white rounded-2xl shadow-lg">

                <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                        {[featureImage, ...images].map((img, i) => (
                            <button key={i} onClick={() => setPreview(img)}>
                                <img
                                    src={img}
                                    alt={`thumb-${i}`}
                                    width={70}
                                    height={70}
                                    className="object-cover rounded border hover:scale-105 transition"
                                />
                            </button>
                        ))}
                    </div>


                    <img
                        src={preview || featureImage}
                        alt={product.title}
                        width={350}
                        height={350}
                        className="object-cover rounded-lg shadow-md"
                    />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{product.title}</h1>

                    {product.salePrice ? (
                        <p className="text-xl text-gray-700 mt-2">
                            <span className="line-through mr-2">₹{product.price}</span>
                            <span className="font-bold text-green-700">₹{product.salePrice}</span>
                        </p>
                    ) : (
                        <p className="text-xl text-gray-700 mt-2">₹{product.price}</p>
                    )}

                    <div
                        className="mt-4 text-gray-600"
                        dangerouslySetInnerHTML={{
                            __html: product.description || "No description available.",
                        }}
                    />

                    <div className="flex flex-wrap items-center gap-4 mt-5">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                            >
                                −
                            </button>

                            <span className="px-2">{quantity}</span>

                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                            >
                                +
                            </button>
                        </div>

                        <p className="text-lg font-medium">
                            Total: ₹
                            {(parseFloat(product.salePrice ?? product.price) || 0) * quantity}
                        </p>

                        <button
                            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                            onClick={handleAddToCart}
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add to Cart"}
                        </button>

                        <button
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {preview && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <button
                            onClick={() => setPreview(null)}
                            className="absolute top-5 right-5 text-white text-3xl font-bold"
                        >
                            ×
                        </button>
                        <Image
                            src={preview}
                            alt="preview"
                            width={600}
                            height={600}
                            className="object-contain rounded-lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}