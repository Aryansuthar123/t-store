import { NextResponse } from "next/server";
import ConnectDB from "../../../utils/database";
import User from "../../../../models/userModel";

export async function POST(req) {
  try {
    await ConnectDB();

    const { email, otp } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // OTP match check
    if (!user.resetOTP || user.resetOTP !== otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" });
    }

    // OTP expiry check
    if (user.otpExpiry < Date.now()) {
      return NextResponse.json({ success: false, message: "OTP expired" });
    }

    // ✅ OTP is correct and valid
    user.otpVerified = true;     // Mark OTP verified
    user.resetOTP = undefined;   // Clear OTP
    user.otpExpiry = undefined;  // Clear expiry
    await user.save();

    return NextResponse.json({ success: true, message: "OTP verified successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Error verifying OTP" },
      { status: 500 }
    );
  }
}
