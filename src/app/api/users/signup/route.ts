import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import nodemailer, { Transporter } from "nodemailer";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("Incoming Signup:", reqBody);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Generate verification token
    const verifyToken = crypto.randomBytes(20).toString("hex");
    const verifyTokenExpiry = Date.now() + 3600000; // 1 hour

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      isAdmin: false,
      role: "user",
      verifyToken,
      verifyTokenExpiry,
    });

    await newUser.save();

    // Setup nodemailer transporter
    const transporter: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verification link
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verifyToken}`;

    const mailOptions = {
      from: `"T-Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - T-Store",
      html: `
        <div style="font-family:Arial,sans-serif;">
          <h2>Welcome to T-Store!</h2>
          <p>Click the button below to verify your email:</p>
          <a href="${verifyUrl}" 
             style="background:#0070f3;color:white;padding:10px 20px;
             text-decoration:none;border-radius:5px;">Verify Email</a>
          <p>If you didn’t request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "User created successfully. Verification email sent!",
      success: true,
    });
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
