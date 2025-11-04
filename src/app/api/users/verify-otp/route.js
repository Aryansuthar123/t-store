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

    
    if (!user.resetOTP || user.resetOTP !== otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return NextResponse.json({ success: false, message: "OTP expired" });
    }

    user.otpVerified = true;     
    user.resetOTP = undefined;   
    user.otpExpiry = undefined;  
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
