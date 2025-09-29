'use client'
import React from 'react';
import Link from 'next/link';
import { ProductContext } from "../context/ProductContext";

const Product = ({ items = [] }) => {
    return (
        <>
            <div className="container my-5">
              <div className='row'>
                {items.length > 0 ? (
                    items.map((product) => (
                      <div
                        key={product._id} className='col-lg-4 col-md-6 my-3 text-center d-flex justify-content-center
                    align-items-center'>
                        <div className='card bg-dark text-light' style={{ width: '18rem' }}>
                             <Link href={`/store/product-details/${product._id}`}>
                                <div className='d-flex justify-content-center align-items-center p-3'>
                                    <img src={
                                      product.featureImage
                                        ? `http://localhost:3000${product.featureImage}`
                                            : product.imgSrc
                                          }
                                           alt={product.title}
                                             className="card-img-top"
                                             style={{
                                             width: "200px",
                                             borderRadius: "10px",
                                             border: "1px solid yellow"
                                            }} />
                                        </div>
                                    </Link>
                                    <div className='card-body'>
                                        <h5 className='card-title'>{product.title}</h5>
                                        <div
                                            className="card-text"
                                            dangerouslySetInnerHTML={{ __html: product.description }}
                                        />
                                        <button className='btn btn-primary mx-3'>{product.price}</button>
                                        <button className='btn btn-warning mx-3'>Card</button>
                                    </div>
                                </div>
                            </div>
                        ))) : (
                        <p className="text-center text-muted">No products available</p>
                    )}
                </div>
            </div>
        </>
    )
}
export default Product; 