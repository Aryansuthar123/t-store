import connectDB from "../../utils/database";
import Product from "@/Models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const products = await Product.find().populate("category");
  return NextResponse.json({ success: true, products });
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newProduct = await Product.create(body);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
