import connectDB from "../../utils/database";
import About from "../../../models/aboutModel";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}



export async function GET() {
  await connectDB();
  const abouts = await About.find().sort({ createdAt: -1 });
  return NextResponse.json(abouts);
}

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image"); 

     if (!title || !description || !category || !image) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

   const path = require("path");
    const fs = require("fs");
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, image.name);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${image.name}`;

    const newAbout = await About.create({
      title,
      description,
      category,
      image,
    });

    return NextResponse.json({ success: true, about: newAbout });
  } catch (err) {
    console.error("Error in POST /api/about:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await About.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}

export async function PUT(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image");

    if (!title || !description || !category || !image) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedAbout = await About.findByIdAndUpdate(
      id,
      { title, description, category, image },
      { new: true }
    );

    if (!updatedAbout) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, about: updatedAbout });
  } catch (err) {
    console.error("Error in PUT /api/about:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
