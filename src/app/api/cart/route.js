// import connectDB from "../../utils/database";
// import { addToCart, clearCart, getCartItems } from "../../controllers/cart";


// //http://localhost:3000/api/cart
// export async function POST(req) {
//     await connectDB();
//     return addToCart(req);
// }

// //http://localhost:3000/api/cart
// export async function GET(req) {
//     await connectDB();
//     return getCartItems(req);
// }
// //http://localhost:3000/api/cart
// export async function DELETE(req) {
//     await connectDB();
//     return clearCart(req);
// }



import Cart from '@/app/Models/Cart';
import { NextResponse } from 'next/server';
import connectDB from "../../utils/database"; 
import {
    addToCart,
    clearCart,
    getCartItems,
    updateCartItem
} from "../../controllers/cart"; 


export async function POST(req) {
    await connectDB();
    return addToCart(req);
}


export async function GET(req) {
    await connectDB();
    return getCartItems(req);
}

export async function PUT(req) {
    await connectDB();
    return updateCartItem(req); 
}




export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id) {
        return NextResponse.json({
            success: false,
            message: "Product ID not provided",
        });
    }

    try {
        await Cart.findByIdAndDelete(_id);
        return NextResponse.json({
            success: true,
            message: "Product removed from cart",
        });
    } catch (error) {
        console.error("Error deleting item:", error);
        return NextResponse.json({
            success: false,
            message: "Error deleting product",
        });
    }
}
