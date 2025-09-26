import connectDB from "@/utils/database";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = params;
  const { isApproved } = await req.json();

  const updated = await Admin.findByIdAndUpdate(
    id,
    { isApproved },
    { new: true }
  );

  return NextResponse.json(updated);
}
