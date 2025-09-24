'use client';
import React from "react";
import { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [data, setData] = useState([]);

    const fetchAllProducts = async () => {
        const api = await axios.get(`${API_BASE_URL}/products`);
        setProducts(api.data.products)
      

        console.log("fetched all products = ", products);
    }
    useEffect(() => {
        fetchAllProducts();

    }, []);
    
      const addProduct = (newProduct) => {
        setProducts((prev) => [...prev, newProduct]); 
    };
    console.log("fetched all products = ", products);
    return (
        <ProductContext.Provider value={{products, data}}>{children}</ProductContext.Provider>
    );
};




export const useProductContext = () => useContext(ProductContext);

export default ProductContext;