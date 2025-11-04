import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import ConnectDB from "../../../utils/database";
import User from "../../../../models/userModel";

export async function POST(req) {
  try {
    await ConnectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ success: false, message: "User not found" });

    if (!user.otpVerified)
      return NextResponse.json({ success: false, message: "OTP not verified" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // ✅ Clear OTP info after successful password reset
    user.resetOTP = undefined;
    user.otpExpiry = undefined;
    user.otpVerified = false;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { success: false, message: "Error resetting password" },
      { status: 500 }
    );
  }
}
