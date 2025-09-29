import Cart from '../Models/Cart';
import { NextResponse } from 'next/server';


export const addToCart = async (req) => {
    const body = await req.json();
     console.log("Cart Item Received:", body);

    const existingItem = await Cart.findOne({ title: body.title });
    if (existingItem) {
        return NextResponse.json({
            success: false,
            message: "Product already in cart",
        });
    }
    const newCart = await Cart.create(body);
    return NextResponse.json({
        success: true,
        message: "Item add to the Cart successfully..!",
        cartItem: newCart
    }

    )
}

export const updateCartItem = async (req) => {
    const body = await req.json();
    const { _id, quantity } = body;

    if (!_id || typeof quantity !== "number") {
        return NextResponse.json({ success: false, message: "Invalid input" });
    }

    try {
        const updatedItem = await Cart.findByIdAndUpdate(_id, { quantity }, { new: true });
        return NextResponse.json({ success: true, cartItem: updatedItem });
    } catch (error) {
        console.error("Error updating cart item:", error);
        return NextResponse.json({ success: false, message: "Error updating item" });
    }
}
export const getCartItems = async (req) => {
    const cartItems = await Cart.find();
    return NextResponse.json({ message: "Fetched all cart item", success: true, cartItems, });
}


export const clearCart = async (req) => {
    await Cart.deleteMany({});
    return NextResponse.json({
        message: "Cart has been cleaed..!",
        success: true,
    })
}