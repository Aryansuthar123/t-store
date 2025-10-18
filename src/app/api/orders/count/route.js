
import connectDB from "../../../utils/database";
import Order from "../../../../models/orderModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const total = await Order.countDocuments();
    return NextResponse.json({ success: true, total });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
