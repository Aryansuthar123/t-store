import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ConnectDB from "../../../utils/database";
import User from "../../../../models/userModel";

export async function POST(req) {
  try {
    await ConnectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // Send OTP Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"T-Store Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    console.log("✅ OTP sent to:", email);

    return NextResponse.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("🔥 Error sending OTP:", error);
    return NextResponse.json({ success: false, message: "Error sending OTP" }, { status: 500 });
  }
}
