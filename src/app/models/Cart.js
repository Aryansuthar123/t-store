import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imgSrc: { type: String, request: true },
    price: { type: String, required: true },
}, { timestamps: true }
);



export default mongoose.models.Cart || mongoose.model("Cart", cartSchema) 