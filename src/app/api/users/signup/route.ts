
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import bcryptjs from "bcryptjs";

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

  
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid Gmail address" },
        { status: 400 }
      );
    }

   
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

  
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: true, 
      isAdmin: false,
      role: "user",
    });

    await newUser.save();

    return NextResponse.json({
      message: "User created successfully!",
      success: true,
    });
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
