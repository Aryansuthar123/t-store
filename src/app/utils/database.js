import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ MongoDB already connected.");
      return;
    }

    await mongoose.connect(
      "mongodb+srv://aryansuthar222_db_user:vD6hjPFTrDFeuL9I@cluster0.pba8a0n.mongodb.net/Next_js_Ecommerce"
    );

    console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

export default connectDB;
