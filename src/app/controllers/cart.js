import Cart from '../Models/Cart';
import { NextResponse } from 'next/server';


// ✅ Add to Cart
export const addToCart = async (req) => {
    try {
        const body = await req.json();
        console.log("Cart Item Received:", body);

        // check if product already exists in cart (by productId or title)
        const existingItem = await Cart.findOne({ title: body.title });
        if (existingItem) {
            return NextResponse.json({
                success: false,
                message: "Product already in cart",
            });
        }

        // create new cart entry (with images)
        const newCart = await Cart.create({
            title: body.title,
            featureImage: body.featureImage || body.imgSrc || "",  // 👈 feature image safe
            images: body.images || [],   // 👈 multiple images safe
            imgSrc: body.imgSrc || "",
            price: body.price,
            salePrice: body.salePrice,
            description: body.description || "",
            quantity: body.quantity || 1,
        });

        return NextResponse.json({
            success: true,
            message: "Item added to Cart successfully!",
            cartItem: newCart
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json({ success: false, message: "Error adding item" });
    }
};


// ✅ Update Cart Item
export const updateCartItem = async (req) => {
    const body = await req.json();
    const { _id, quantity } = body;

    if (!_id || typeof quantity !== "number") {
        return NextResponse.json({ success: false, message: "Invalid input" });
    }

    try {
        const updatedItem = await Cart.findByIdAndUpdate(
            _id,
            { quantity },
            { new: true }
        );
        return NextResponse.json({ success: true, cartItem: updatedItem });
    } catch (error) {
        console.error("Error updating cart item:", error);
        return NextResponse.json({ success: false, message: "Error updating item" });
    }
};


// ✅ Get all Cart Items
export const getCartItems = async () => {
    try {
        const cartItems = await Cart.find();
        return NextResponse.json({
            message: "Fetched all cart items",
            success: true,
            cartItems,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error fetching cart items" });
    }
};


// ✅ Clear Cart
export const clearCart = async () => {
    try {
        await Cart.deleteMany({});
        return NextResponse.json({
            message: "Cart has been cleared!",
            success: true,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error clearing cart" });
    }
};
