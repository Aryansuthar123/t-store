import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, default: "Trending" },
}, { timestamps: true });

export default mongoose.models.About || mongoose.model("About", aboutSchema);
