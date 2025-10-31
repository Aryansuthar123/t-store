

import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import connectDB from "../../utils/database"; 

import Order from "../../../models/orderModel";
 
export async function GET() {
  await connectDB();

  try {
    const products = await Product.find().sort({ createdAt: -1 });

    // Aggregate orders by product._id
    const orderCounts = await Order.aggregate([
      { $group: { _id: "$product._id", count: { $sum: 1 } } }
    ]);

    // Map product _id to order count
    const orderMap = {};
    orderCounts.forEach(o => {
      if (o._id) orderMap[o._id.toString()] = o.count;
    });

    // Attach orders count to products
    const productsWithOrders = products.map(p => ({
      ...p.toObject(),
      orders: orderMap[p._id.toString()] || 0
    }));

    return NextResponse.json({ success: true, products: productsWithOrders });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function POST(req) {
  await connectDB();
  try {
    const form = await req.formData();

    const title            = form.get("title");
    const shortDescription = form.get("shortDescription");
    const description      = form.get("description");
    const category         = form.get("category");
    const stock            = Number(form.get("stock") || 0);
    const price            = Number(form.get("price") || 0);
    const salePrice        = form.get("salePrice") ? Number(form.get("salePrice")) : undefined;

    const featureImage     = form.get("featureImage");
    let featureImageUrl    = "";
    if (featureImage && featureImage.size > 0) {
      const bytes    = await featureImage.arrayBuffer();
      const buffer   = Buffer.from(bytes);
      const filename = `${uuidv4()}-${featureImage.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filePath, buffer);
      featureImageUrl = `/uploads/${filename}`;
    }

    const galleryImages = form.getAll("images");
    const imageUrls     = [];
    for (const img of galleryImages) {
      if (img && img.size > 0) {
        const bytes    = await img.arrayBuffer();
        const buffer   = Buffer.from(bytes);
        const filename = `${uuidv4()}-${img.name}`;
        const filePath = path.join(process.cwd(), "public", "uploads", filename);
        await writeFile(filePath, buffer);
        imageUrls.push(`/uploads/${filename}`);
      }
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
      images: imageUrls
    });

    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
