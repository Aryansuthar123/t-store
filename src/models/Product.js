
import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String }, 
  description: { type: String },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },  
  price: { type: Number, required: true },
  salePrice: { type: Number },
  featureImage: { type: String }, 
  images: [{ type: String }], 
  imgSrc: { type: String },
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
