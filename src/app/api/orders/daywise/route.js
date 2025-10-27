import connectDB from "../../../utils/database";
import Order from "../../../../models/orderModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({}, { createdAt: 1, orderDate: 1 });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const counts = {};

    orders.forEach((o) => {

      let dateValue = o.createdAt || o.orderDate;

      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        console.warn("Skipping invalid order:", o._id, dateValue);
        return;
      }

      const dateString = date.toISOString().split("T")[0];
      counts[dateString] = (counts[dateString] || 0) + 1;
    });

    const data = Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching daywise orders:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
