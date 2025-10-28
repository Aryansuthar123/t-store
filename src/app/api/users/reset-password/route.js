import { NextResponse } from "next/server";
import User from "../../../../models/userModel";
import connectDB from "../../../utils/database";
import bcryptjs from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    const admin = await User.findOne({
      email,
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
      isAdmin: true,
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" });
    }

    admin.password = await bcryptjs.hash(newPassword, 10);
    admin.forgotPasswordToken = undefined;
    admin.forgotPasswordTokenExpiry = undefined;
    await admin.save();

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" });
  }
}