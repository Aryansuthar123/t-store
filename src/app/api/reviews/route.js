import { NextResponse } from "next/server";
import ConnectDB from "../../utils/database";
import Review from "../../../models/Reviews";

export async function GET() {
  await ConnectDB();

  try {
    const reviews = await Review.find({});
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await ConnectDB();

  try {
    const body = await request.json();
    const { name, comment, rating, productId } = body;

    
    if (!name || !comment || !productId) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const newReview = await Review.create({ name, comment, rating, productId });
    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
