'use client'
import React from 'react';
import Link from 'next/link';
import { useProductContext } from "../context/ProductContext";

export default function Product() {
    const { products } = useProductContext();

    return (
        <div className="container-fluid px-1 my-5 ">
           
            <div className="row gx-2 gy-4 justify-content-center"
            style={{ marginLeft: "30px", marginRight: "30px" }}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div
                            key={product._id}
                            className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex" >
                            <div 
                                className="p-3 rounded shadow-sm d-flex flex-column justify-content-between w-100"
                                style={{ border: "none" }} >

                                <Link href={`/store/product-details/${product._id}`}>
                                    <img
                                        src={
                                            product.featureImage && product.featureImage.trim() !== ''
                                                ? product.featureImage
                                                : product.imgSrc || '/placeholder.jpg'
                                        }
                                        alt={product.title}
                                        className="img-fluid mb-3"
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'contain'
                                        }}  />
                                </Link>

                                <div className="flex-grow-1">
                                    <h6 className="fw-bold text-center">{product.title}</h6>
                                    <p className="text-muted small text-center" 
                                       dangerouslySetInnerHTML={{ __html: product.description || '' }} />

                                    {product.salePrice ? (
                                        <p className="text-center mb-2">
                                            <span className="text-muted text-decoration-line-through me-2">
                                                ₹{product.price}
                                            </span>
                                            <span className="text-success fw-bold">
                                                ₹{product.salePrice}
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="fw-bold text-center">₹{product.price}</p>
                                    )}
                                </div>

                               
                                <div className="mt-auto text-center">
                                    <button className="btn btn-warning btn-sm px-4 py-2">Add to Cart</button>
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
