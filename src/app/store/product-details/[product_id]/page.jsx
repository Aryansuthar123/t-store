'use client';
import { useParams } from "next/navigation";
import { useProductContext } from "../../../context/ProductContext";
import Image from "next/image";
import { useCart } from '../../../context/CartContext';
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (typeof window === 'undefined') return null;


    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token payload:", payload);
        return payload;
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}

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
    const [currentSlide, setCurrentSlide] = useState(0);
    const reviewsPerSlide = 2;
    const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide((prev) => prev - 1);
        }
    };

    const product = products.find((p) => p._id === product_id);
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews/${product_id}`);
                const data = await res.json();
                if (data.success) {
                    setReviews(data.reviews);
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            }
        };
        if (product_id) fetchReviews();
    }, [product_id]);

    if (!product) {
        return (<h1 className="text-center text-red-500 text-xl"> Product Not Found</h1>
        );
    }

    const relatedProducts = products.filter(
        (p) => p.category === product.category && p._id !== product._id);

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

        const user = getUserFromToken();

        if (!user?.username) {
            toast.error("You must be logged in to submit a review");
            return;
        }

        if (!product_id) {
            toast.error("Invalid product ID");
            return;
        }

        setSubmittingReview(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: product_id,
                    name: user?.username || "Anonyson",
                    rating: newRating,
                    comment: newReview
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error("Server returned error:", errorText);
                throw new Error(`Server error: ${res.status}`);
            }
            const data = await res.json();

            if (data.success) {
                setReviews(prev => [data.review, ...prev]);
                toast.success("Review submitted!");
                setNewReview("");
                setNewRating(5);
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            toast.error("Submission failed");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-12 py-10">
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
                        className="object-cover rounded-lg shadow-md" />
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
                        <div className="flex items-center gap-2">
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
                            className="bg-pink-500 text-white px-3 py-1 !rounded-lg hover:bg-pink-300 disabled:opacity-50"
                            onClick={handleAddToCart}
                            disabled={loading} >
                            {loading ? "Adding..." : "Add to Cart"}
                        </button>

                        <button
                            className="bg-orange-400 text-white px-3 py-1 !rounded-lg hover:bg-amber-600"
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

            <div className="max-w-7xl mt-10 bg-white p-4 rounded-md border border-gray-300">
                <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

                {reviews.length > 0 ? (
                    <div className="relative">
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ease-in-out">
                            {reviews
                                .slice(currentSlide * reviewsPerSlide, currentSlide * reviewsPerSlide + reviewsPerSlide)
                                .map((review, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 rounded-md p-4 bg-gray-50 shadow-sm">
                                        <p className="font-semibold text-gray-800">{review.name}</p>
                                        <p className="text-gray-700 my-2 break-words">{review.comment}</p>
                                        <div className="text-yellow-500">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                                ← Previous
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={currentSlide === totalSlides - 1}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                                Next →
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to write one!</p>
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
                                    className="text-2xl focus:outline-none" >
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
                        className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-700"
                        disabled={submittingReview || !newReview} >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>

                </div>
            </div>
            {relatedProducts.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-3 pb-2">Related Products</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {relatedProducts.map((related) => (
                            <div
                                key={related._id}
                                className="border rounded-xl p-4 hover:shadow-lg transition bg-white flex flex-col justify-between h-full" >

                                <div className="flex flex-col flex-grow">
                                    <img
                                        src={related.featureImage || related.images?.[0] || "/placeholder.jpg"}
                                        alt={related.title}
                                        className="w-full h-48 object-contain mb-3" />
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{related.title}</h3>

                                    <div
                                        className="text-gray-600 text-sm mb-3 line-clamp-2"
                                        dangerouslySetInnerHTML={{
                                            __html: related.description || "No description available.",
                                        }} />

                                    {related.salePrice ? (
                                        <p className="text-lg text-gray-700 mt-auto">
                                            <span className="line-through mr-2">₹{related.price}</span>
                                            <span className="font-bold text-green-700">₹{related.salePrice}</span>
                                        </p>
                                    ) : (
                                        <p className="text-lg text-gray-700 mt-auto font-medium">₹{related.price}</p>
                                    )}
                                </div>


                                <div className="mt-4">
                                    <button
                                        onClick={() => router.push(`/store/product-details/${related._id}`)}
                                        className=" bg-pink-500 text-white px-3 py-1 !rounded-lg hover:bg-pink-400 transition" >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
