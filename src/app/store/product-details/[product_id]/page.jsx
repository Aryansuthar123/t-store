// import { getProducts } from "@/library";
// import Container from "@/components/Container";
// import styles from "@/styles/product-details"
// import React from "react";

// export default async function ProductDetails({params}) 
// {
//     const product = await getProducts(params.product_id); 
//         console.log("product", product);
//         return(
//             <Container>
//                 <div className="py-12 px-4">
//                     <div className="flex flex-col md:flex-row items-start bg-white">
//                      {/* Product Image */}
//                         <img
//                             src={product.image}
//                             alt={product.title}
//                             className={`${styles.productImage} w-full md:w-1/2 object-cover`}
//                         />
//                         <div className="p-6 md:w-1/2">
//                             <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product.title}</h1>
//                             <p className="text-gray-600 mb-4">{product.description}</p>
//                             <p className="text-lg font-semibold text-gray-900 mb-4">
//                               Price: ${product.price}</p>
//                                     {product.discount && (
//                                     <p className="text-md text-red-500 mb-4">Discount: {product.discount}% off</p>
//                              )}
//                              <ul className="text-gray-700 space-y-2">
//                                 <li><strong>Brand:</strong> {product.brand}</li>
//                                 <li><strong>Model:</strong> {product.model}</li>
//                                 <li><strong>Color:</strong> {product.color}</li>
//                                 <li><strong>Category:</strong> {product.category}</li>
//                             </ul>
//                             <button className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg">
//                                 Add to Card
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </Container>
//         )
// }



'use client';
import { useParams } from "next/navigation";
import { useProductContext } from "../../../context/ProductContext";
import Image from "next/image";
import { useCart } from '../../../context/CartContext';
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
    const { products } = useProductContext();
    const { product_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { fetchCartItems } = useCart();

    const product = products.find((p) => p._id === product_id);

    if (!product) {
        return <h1 className="text-center text-red-500 text-xl"> Product Not Found</h1>;
    }
  
    const handleAddToCart = async () => {
        setLoading(true);
        setMessage("");

        const cartItem = {
            title: product.title,
            imgSrc: product.featureImage,
            price: product.price,
            description: product.description,
            quantity: 1,
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
    return (
        <div className="max-w-4xl mx-auto p-6">

            <Image
                src={product.featureImage || "/placeholder.jpg"}
                alt={product.title}
                width={300}
                height={300}
                className="object-cover  shadow-amber-400 rounded-lg shadow-md"
            />


            <h1 className="text-3xl font-bold mt-8">{product.title}</h1>
            <p className="text-xl text-gray-700 border-amber-200 mt-2">₹{product.price}</p>


            <div
                className="mt-4 text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.description || "No description available." }}
            />


            <div className="flex gap-4 mt-6">
                <button
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                    onClick={handleAddToCart}
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add to Cart"}
                </button>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Buy Now
                </button>
            </div>
        </div>
    );
}
