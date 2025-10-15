import connectDB from "../../../utils/database";
import Order from "../../../../models/orderModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const order = await Order.findById(id);

    if (!order)
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted)
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}