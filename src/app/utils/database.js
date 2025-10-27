
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ MongoDB already connected.");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

export default connectDB;
