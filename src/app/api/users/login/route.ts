import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const reqBody = await request.json();
    let { email, password, adminLogin } = reqBody;

    // Convert string to boolean safely
    if (typeof adminLogin === "string") {
      adminLogin = adminLogin === "true";
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
    }

    // Lowercase email for DB match
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 400 });
    }

    // Password check
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }

    // Admin check only if adminLogin=true AND user actually wants admin panel
    if (adminLogin === true && !user.isAdmin) {
      return NextResponse.json({ success: false, error: "Not authorized for admin panel" }, { status: 403 });
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role || "user",
    };

    const secret = process.env.TOKEN_SECRET;
    if (!secret) throw new Error("TOKEN_SECRET is not defined");

    const token = jwt.sign(tokenData, secret, { expiresIn: "1d" });

    const response = NextResponse.json({
      success: true,
      message: "Login successfully",
      user: tokenData,
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
