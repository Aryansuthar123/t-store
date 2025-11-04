import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import connectDB from "../../utils/database";
import Product from "../../../models/Product";
import Order from "../../../models/orderModel";


import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  await connectDB();
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const orderCounts = await Order.aggregate([
      { $group: { _id: "$product", count: { $sum: 1 } } }
    ]);

    const orderMap = {};
    orderCounts.forEach(o => {
      if (o._id) orderMap[o._id.toString()] = o.count;
    });

    const productsWithOrders = products.map(p => ({
      ...p.toObject(),
      orders: orderMap[p._id.toString()] || 0
    }));

    return NextResponse.json({ success: true, products: productsWithOrders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const form = await req.formData();
    const uploadToCloudinary = async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      const uploadRes = await cloudinary.uploader.upload(base64, {
        folder: "products",
        public_id: uuidv4(),
      });
      return uploadRes.secure_url;
    };

    const title = form.get("title");
    const shortDescription = form.get("shortDescription");
    const description = form.get("description");
    const category = form.get("category");
    const stock = Number(form.get("stock") || 0);
    const price = Number(form.get("price") || 0);
    const salePrice = form.get("salePrice") ? Number(form.get("salePrice")) : undefined;
    
    const featureImage = form.get("featureImage");
    const featureImageUrl = featureImage?.size > 0 ? await uploadToCloudinary(featureImage) : "";

    const galleryImages = form.getAll("images");
    const imageUrls = [];
    for (const img of galleryImages) {
      if (img?.size > 0) imageUrls.push(await uploadToCloudinary(img));
    }

    const product = await Product.create({
      title,
      shortDescription,
      description,
      category,
      stock,
      price,
      salePrice,
      featureImage: featureImageUrl,
      images: imageUrls,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("❌ Product upload error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
