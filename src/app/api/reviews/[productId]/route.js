import { NextResponse } from "next/server";
import ConnectDB from "../../../utils/database";
import Review from "../../../../models/Reviews";

export async function GET(_, { params }) {
  await ConnectDB();

  const { productId } = await params;
  
  try {
    const reviews = await Review.find({ productId });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
