import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, message: "Token missing" });
    }

    console.log("🔍 Verifying token:", token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt:  new Date() },
    });

    if (!user) {
      console.log("❌ Invalid or expired token");
      return NextResponse.json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    console.log("✅ User verified:", user.email);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("❌ Verification Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during verification" },
      { status: 500 }
    );
  }
}
