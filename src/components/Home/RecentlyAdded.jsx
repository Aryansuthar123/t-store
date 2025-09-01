"use client"
import React, { useEffect, useState } from "react";
import Container from '../Container'
import ProductBox from "../ProductBox";


 export default function RecentlyAdded() {
  const [products, setProduct] = useState([]);
  const getProducts = async () => {
    const response = await fetch('https://fakestoreapi.in/api/products?limit=5');
    const data = await response.json();
    // console.log(data);
    setProduct(data.products);
  }
  useEffect(
    () => {
      getProducts();
    }, []
  )
    return(
      <div className="bg-gray-100 p-3">
        <Container>
         <h1 className="text-center text-3xl font-bold">Recently Added Products</h1>
         <div className="my-4 grid grid-cols-5 gap-3">
            {
              products.map(
                (prod) => {
                  return <ProductBox key={prod.id} product={prod}/> 
                }
              )
            }
         </div>
        </Container>
      </div>
    )
 }