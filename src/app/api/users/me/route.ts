import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";

connectDB();

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: "No token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    const user = await User.findById((decoded as any).id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" });
    }
    return NextResponse.json({ success: true, user: { 
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    }});
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid token" });
  }
}
