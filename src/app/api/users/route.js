// import connectDB from "../../utils/database";
// import User from "../../../models/userModel";
// import { NextResponse } from "next/server";



// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const role = searchParams.get("role");

//     let query = {};
//     if (role === "admin") {
//       query.isAdmin = true;  
//     }

//     const users = await User.find(query);
//     return NextResponse.json({ success: true, users });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


// export async function POST(req) {
//   await connectDB();
//   const { username, email, password, isAdmin } = await req.json();

//   const newUser = new User({
//     username,
//     email,
//     password,
//     isAdmin: !!isAdmin,   
//   });
//   await newUser.save();

//   return NextResponse.json({ success: true, user: newUser });
// }



import connectDB from "../../utils/database";
import User from "../../../models/userModel"
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const query = role === "admin" ? { isAdmin: true } : {};
    const users = await User.find(query);
    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const form = await req.formData();
    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password") || "123456";
    const image = form.get("image") || "";
    const imageName = imageFile?.name || "";

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Username or Email already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log(" Incoming Data =>", { username, email, password, image });
    const newUser = await User.create({
      username,
      email,
      password: hashed,
      image,
      isAdmin: true,
      isApproved: true
    });
    console.log("User Created =>", newUser);
    return NextResponse.json({ success: true, user: newUser });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}