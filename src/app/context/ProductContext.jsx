'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/api/products`;
      console.log("Fetching products from:", url);

      const res = await axios.get(url);
      if (res.data?.products) {
        setProducts(res.data.products);
        console.log("Fetched products:", res.data.products);
      } else {
        setProducts([]);
        console.warn("No products found in response:", res.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, error, fetchAllProducts, addProduct }} >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

export default ProductContext;
