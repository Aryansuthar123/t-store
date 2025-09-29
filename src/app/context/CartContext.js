'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = async () => {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            if (data.success) {
                setCartItems(data.cartItems);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, fetchCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
