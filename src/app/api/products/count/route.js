import connectDB from "../../../utils/database";   
import Product from "../../../../models/Product";  
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const total = await Product.countDocuments();
    return NextResponse.json({ total });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
