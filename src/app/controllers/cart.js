import Cart from '../Models/Cart';
import { NextResponse } from 'next/server';


export const addToCart = async (req) => {
    const body = await req.json();
    const newCart = await Cart.create(body);
    return NextResponse.json({
        message: "Item add to the Cart successfully..!", success: true,
        cartItem: newCart
    }

    )
}

// get items from cart
export const getCartItems = async (req) => {
    const cartItems = await Cart.find();
    return NextResponse.json({ message: "Fetched all cart item", success: true, cartItems, });
}

// clear all cart items
export const clearCart = async (req) => {
    await Cart.deleteMany({});
    return NextResponse.json({message: "Cart has been cleaed..!",
        success: true,
    })
}