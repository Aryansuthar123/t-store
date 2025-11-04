import { NextResponse } from "next/server";
import ConnectDB from "../../../utils/database";
import User from "../../../../models/userModel";

export async function POST(req) {
  try {
    await ConnectDB();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (!user.otpVerified)
      return NextResponse.json({ success: false, message: "OTP not verified" }, { status: 403 });

   
    user.password = password;

    user.otpVerified = false;
    user.resetOTP = undefined;
    user.otpExpiry = undefined;

    await user.save(); 

    return NextResponse.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
