import connectDB from "@/utils/database";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  try {
    const { name, email, password, image } = await req.json();

    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    const newAdmin = await User.create({
      username: name,
      email,
      password: hashedPassword,
      isAdmin: true,       
      isApproved: true,   
      image,                
    });

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
