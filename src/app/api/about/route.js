import { NextResponse } from "next/server";
import ConnectDB from "../../utils/database";
import About from "../../../models/aboutModel";
import path from "path";
import { promises as fsPromises } from "fs";

export async function GET() {
  await ConnectDB();
  const abouts = await About.find().sort({ createdAt: -1 });
  return NextResponse.json(abouts);
}

export async function POST(req) {
  await ConnectDB();
  const formData = await req.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category") || "Trending";
  const imageFile = formData.get("image");

  let imagePath = "";

  
  if (imageFile && typeof imageFile === "object" && imageFile.name) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await fsPromises.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, imageFile.name);
    await fsPromises.writeFile(filePath, buffer);

    imagePath = `/uploads/${imageFile.name}`;
  } else if (typeof imageFile === "string") {
    imagePath = imageFile;
  }

  const newAbout = new About({
    title,
    description,
    image: imagePath,
    category,
  });

  await newAbout.save();

  return NextResponse.json({ success: true, data: newAbout });
}

export async function PUT(req) {
  await ConnectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const formData = await req.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const image = formData.get("image");

  const updateData = { title, description, category };
  if (image) updateData.image = image;

  await About.findByIdAndUpdate(id, updateData);
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  await ConnectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await About.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}