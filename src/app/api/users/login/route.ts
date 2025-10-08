import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";



export async function POST(request: NextRequest) {
 
  try {
    await connectDB();
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 400 }
      );
    }
if (!user.isApproved) {
  return NextResponse.json(
    { success: false, error: "Your account is not approved yet. Please contact admin." },
    { status: 403 }
  );
}
    
    const validPassword = await bcryptjs.compare(password, user.password);
    console.log("Password match result:", validPassword);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }
    
    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined");
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
       
       isAdmin: user.isAdmin,
       isApproved: user.isApproved, 
        role: user.role || "user", 
    };

  
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

  console.log("Generated token:", token);

    const response = NextResponse.json({
      success: true,
      message: "Login successfully",
      user: tokenData,
      token: token,
    });

   response.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  path: "/",    
  sameSite: "lax",      
  maxAge: 60 * 60 * 24, 
});

    return response;
  } catch (error: unknown) {
  const message =
    error instanceof Error ? error.message : "Something went wrong";
  console.error("Login API Error:", message);
  return NextResponse.json(
    { success: false, error: message },
    { status: 500 }
  );
}

}
