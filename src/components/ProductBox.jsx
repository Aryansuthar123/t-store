'use client';
import styles from '@/styles/productbox.module.css';
import Image from "next/image";
import Link from 'next/link';


export default function ProductBox({ product }) {

    const imgSrc = product.featureImage && product.featureImage.trim() !== ""
        ? product.featureImage
        : "/placeholder.jpg";
    const productId = product._id || product.id;


      return (
        <div className={`${styles.cart} bg-white p-4  rounded-lg w-full`}>
            <Link href={`/store/product-details/${productId}`}>
                <Image
                    width={300}
                    height={150}
                    src={imgSrc}
                    alt={product.title || "Product"}
                    className={`${styles.productImage} w-full h-48 object-cover rounded-md`}
                />
            </Link>

            <div className="mt-4">
                <h3 className="text-xs min-h-[40-px] font-medium text-gray-800">
                    {product.title}
                </h3>

                {product.salePrice ? (
                    <p className="text-gray-900 font-semibold mt-2">
                        <span className="line-through mr-2 text-gray-500">
                            ₹{product.price}
                        </span>
                        <span className="text-green-700 font-bold">
                            ₹{product.salePrice}
                        </span>
                    </p>
                ) : (
                    <p className="text-gray-900 font-semibold mt-2">
                        ₹{product.price}
                    </p>
                )}

                <Link href={`/store/product-details/${productId}`}>
                    <button className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-300 hover:text-pink-500 transition duration-300 mt-3">
                        View Now
                    </button>
                </Link>
            </div>
        </div>
    );
}