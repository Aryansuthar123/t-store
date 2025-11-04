

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

   
    const orderCounts = await Order.aggregate([
      { $group: { _id: "$product._id", count: { $sum: 1 } } }
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
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();

    const {
      title,
      shortDescription,
      description,
      category,
      stock,
      price,
      salePrice,
      featureImage,
      images,
    } = body;

    const product = await Product.create({
      title,
      shortDescription,
      description,
      category,
      stock,
      price,
      salePrice,
      featureImage,
      images,
    });

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("❌ Product creation error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
