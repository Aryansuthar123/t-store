'use client';
import React from "react";
import { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";


const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [data, setData] = useState([]);

    const fetchAllProducts = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(res.data.products);
        console.log("fetched all products = ", res.data.products);
    } catch (err) {
        console.error("Error fetching products:", err);
    }
};

    useEffect(() => {
        fetchAllProducts();

    }, []);
    
      const addProduct = (newProduct) => {
        setProducts((prev) => [...prev, newProduct]); 
    };
    console.log("fetched all products = ", products);
    return (
        <ProductContext.Provider value={{products, data ,addProduct}}>
            {children}</ProductContext.Provider>
    );
};
    

export const useProductContext = () => useContext(ProductContext);

export default ProductContext;