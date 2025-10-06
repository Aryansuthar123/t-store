

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

    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviews, setReviews] = useState([]);

    const product = products.find((p) => p._id === product_id);

    if (!product) {
        return (<h1 className="text-center text-red-500 text-xl"> Product Not Found</h1>
        );
    }

    const relatedProducts = products.filter(
        (p) => p.category === product.category && p._id !== product._id
    );

    const featureImage = product?.featureImage || "/placeholder.jpg";
    const images = product?.images || [];



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
            id: product._id,
            title: product.title,
            featureImage: product.featureImage || product.images?.[0] || "/placeholder.jpg",
            images: product.images || [],
            price: product.price,
            salePrice: product.salePrice ?? null,
            description: product.description,
            quantity: quantity,
        };

        localStorage.setItem("checkoutProduct", JSON.stringify(checkoutProduct));
        router.push("/checkout");
    };
    const handleSubmitReview = async () => {
        if (!newReview) return;

        setSubmittingReview(true);
        await new Promise((res) => setTimeout(res, 800));

        const newReviewObj = {
            user: "Anonymous",
            rating: newRating,
            comment: newReview,
        };

        setReviews((prev) => [newReviewObj, ...prev]);
        toast.success("Review submitted!");
        setNewReview("");
        setNewRating(5);
        setSubmittingReview(false);
    };
    return (
        <div className="max-w-6xl mx-auto px-0 py-10">
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-6 bg-white rounded-2xl border border-gray-400">

                <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                        {[featureImage, ...images].map((img, i) => (
                            <button key={i} onClick={() => setPreview(img)}>
                                <img
                                    src={img}
                                    alt={`thumb-${i}`}
                                    width={70}
                                    height={70}
                                    className="object-cover rounded border hover:scale-105 transition" />
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
                        }} />

                    <div className="flex flex-wrap items-center gap-4 mt-5">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" >
                                −
                            </button>
                            <span className="px-2">{quantity}</span>

                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" >
                                +
                            </button>
                        </div>

                        <p className="text-lg font-medium">
                            Total: ₹
                            {(parseFloat(product.salePrice ?? product.price) || 0) * quantity}
                        </p>

                        <button
                            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-300 disabled:opacity-50"
                            onClick={handleAddToCart}
                            disabled={loading} >
                            {loading ? "Adding..." : "Add to Cart"}
                        </button>

                        <button
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                            onClick={handleBuyNow}   >
                            Buy Now
                        </button>
                    </div>
                </div>

                {preview && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <button
                            onClick={() => setPreview(null)}
                            className="absolute top-5 right-5 text-white text-3xl font-bold" >
                            ×
                        </button>
                        <Image
                            src={preview}
                            alt="preview"
                            width={600}
                            height={600}
                            className="object-contain rounded-lg" />
                    </div>
                )}
            </div>

            <div className="max-w-2xl ml-0   mt-10 bg-white p-3 rounded-md border border-gray-300 overflow-hidden">
                <h2 className="text-2xl font-semibold mb-3">Customer Reviews</h2>

                {reviews.length > 0 ? (
                    <div className="space-y-4 mb-6">
                        {reviews.map((review, idx) => (
                            <div key={idx} className="border-b pb-3">
                                <p className="font-semibold">{review.user}</p>
                                <div className="text-yellow-500">
                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </div>
                                <p className="text-gray-800 break-words">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 mb-1">No reviews yet. Be the first to write one!</p>
                )}
            </div>
            <div>
                <div className="max-w-2xl ml-0  mt-4 bg-white p-3  rounded-md border border-gray-300">
                    <h3 className="text-xl font-medium mb-3">Write a Review</h3>
                    <div className="flex items-center gap-2 mb-2">
                        <label className="font-medium">Rating:</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setNewRating(star)}
                                    className="text-2xl focus:outline-none"
                                >
                                    <span className={star <= newRating ? "text-yellow-500" : "text-gray-300"}>
                                        ★
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <textarea
                        className="w-full border rounded p-2 mb-2"
                        rows={3}
                        placeholder="Share your thoughts about the product..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)} />

                    <button
                        onClick={handleSubmitReview}
                        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                        disabled={submittingReview || !newReview} >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>

                </div>
            </div>
            {relatedProducts.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-3  pb-2">Related Products</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {relatedProducts.map((related) => (
                            <div
                                key={related._id}
                                className="border rounded-lg p-4 hover:shadow-lg transition" >
                                <img
                                    src={related.featureImage || related.images?.[0] || "/placeholder.jpg"}
                                    alt={related.title}
                                    className="w-full h-48 object-contain mb-3" />
                                <h3 className="font-medium text-lg">{related.title}</h3>
                                <div
                                    className="mt-4 text-gray-600"
                                    dangerouslySetInnerHTML={{
                                        __html: product.description || "No description available.",
                                    }} />

                                {product.salePrice ? (
                                    <p className="text-xl text-gray-700 mt-2">
                                        <span className="line-through mr-2">₹{product.price}</span>
                                        <span className="font-bold text-green-700">₹{product.salePrice}</span>
                                    </p>
                                ) : (
                                    <p className="text-xl text-gray-700 mt-2">₹{product.price}</p>
                                )}

                                <button
                                    onClick={() => router.push(`/store/product-details/${related._id}`)}
                                    className="mt-3 bg-pink-500 text-white w-full py-2 rounded hover:bg-pink-400">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
