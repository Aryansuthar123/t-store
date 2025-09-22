import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
