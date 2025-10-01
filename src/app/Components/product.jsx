'use client'
import React from 'react';
import Link from 'next/link';
import { useProductContext } from "../context/ProductContext";

export default function Product() {

    const { products } = useProductContext();

    return (
        <div className="container my-5">
            <div className="row">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div
                            key={product._id}
                            className="col-lg-4 col-md-6 my-3 text-center d-flex justify-content-center align-items-center"
                        >
                            <div className="card bg-dark text-light" style={{ width: '18rem' }}>
                                <Link href={`/store/product-details/${product._id}`}>
                                    <div className="d-flex justify-content-center align-items-center p-3">
                                        <img
                                            src={
                                                product.featureImage && product.featureImage.trim() !== ''
                                                    ? product.featureImage
                                                    : product.imgSrc || '/placeholder.jpg'
                                            }
                                            alt={product.title}
                                            className="card-img-top"
                                            style={{
                                                width: '200px',
                                                borderRadius: '10px',
                                                border: '1px solid yellow',
                                            }}
                                        />
                                    </div>
                                </Link>

                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>

                                    <div
                                        className="card-text"
                                        dangerouslySetInnerHTML={{ __html: product.description || '' }}
                                    />
                                    {product.salePrice !== null &&
                                        product.salePrice !== undefined &&
                                        product.salePrice !== '' ? (
                                        <p className="mt-2">
                                            <span className="text-muted text-decoration-line-through me-2">
                                                ₹{product.price}
                                            </span>
                                            <span className="fw-bold text-success">
                                                ₹{product.salePrice}
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="mt-2 fw-bold">
                                            ₹{product.price}
                                        </p>
                                    )}



                                    <button className="btn btn-warning mx-1">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No products available</p>
                )}
            </div>
        </div>
    );
}
