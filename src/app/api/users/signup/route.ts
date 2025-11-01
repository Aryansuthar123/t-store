import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import type { Transporter } from "nodemailer";

connectDB();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("Incoming Signup:", reqBody);

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

  
    const verifyToken = crypto.randomBytes(20).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

 
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry,
      isVerified: false,
    });
    await newUser.save();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
   const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verifyToken}`;

    await transporter.sendMail({
      from: `"T-Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
        <h3>Hi ${username},</h3>
        <p>Thank you for signing up on T-Store.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}" target="_blank" 
          style="background-color:#ec4899;color:white;padding:10px 15px;border-radius:5px;text-decoration:none;">
          Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Signup successful! Verification email sent.",
    });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
