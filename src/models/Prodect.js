import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imgSrc: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
