import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imgSrc: { type: String, request: true },
    price: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, default: 1 }
}, { timestamps: true }
);



export default mongoose.models.Cart || mongoose.model("Cart", cartSchema)   