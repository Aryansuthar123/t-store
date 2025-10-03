import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    title: { type: String, required: true },
    featureImage: { type: String },
    images: [{ type: String }],  
    imgSrc: { type: String, required: true }, 
    price: { type: Number, required: true },  
    salePrice: { type: Number },              
    description: { type: String },
    quantity: { type: Number, default: 1 },
 },
  { timestamps: true }
);


export default mongoose.models.Cart || mongoose.model("Cart", cartSchema)   