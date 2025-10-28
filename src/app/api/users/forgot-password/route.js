import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" });
    }

    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" });
    }

    // ✅ Generate token
    const token = crypto.randomBytes(32).toString("hex");
    admin.forgotPasswordToken = token;
    admin.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await admin.save();

    // ✅ Ethereal test account
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password/${token}?email=${email}`;

    let info = await transporter.sendMail({
      from: '"T-Store Admin" <no-reply@tstore.com>',
      to: admin.email,
      subject: "Admin Password Reset",
      html: `
        <p>Hello ${admin.username || "Admin"},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      success: true,
      message: "Reset link sent successfully (check console preview URL)",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" });
  }
}