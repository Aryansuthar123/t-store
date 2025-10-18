import connectDB from "../../utils/database";
import Order from "../../../models/orderModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    
    if (!data.paymentStatus) data.paymentStatus = "Paid";

    const newOrder = new Order(data);
    await newOrder.save();

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

