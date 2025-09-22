import connectDB from "../../utils/database";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const image = formData.get("image")


    if (!name || !email  ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }
    let imageUrl = null;
  if (image && image.size > 0) {
   const bytes = await image.arrayBuffer();
       const buffer = Buffer.from(bytes);
   
       const uploadDir = path.join(process.cwd(), "public/uploads");
       const filePath = path.join(uploadDir, image.name);
   
       await writeFile(filePath, buffer);
   
        imageUrl = `/uploads/${image.name}`;
  }
    const newAdmin = await Admin.create({
      name, 
      email,
      image: imageUrl,
      
      
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectDB();
    const admins = await Admin.find().select("name image email");
    return NextResponse.json({ success: true, admins });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
