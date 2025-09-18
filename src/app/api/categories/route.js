import connectDB from "../../utils/database";
import Category from "@/Models/Category";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name");
    const slug = formData.get("slug");
    const image = formData.get("image");

    if (!name || !slug || !image) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, image.name);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${image.name}`;

    
    const newCategory = await Category.create({
      name,
      slug,
      image: imageUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
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
    const categories = await Category.find();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
