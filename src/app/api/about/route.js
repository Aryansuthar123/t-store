import { NextResponse } from "next/server";
import ConnectDB from "../../utils/database";
import About from "../../../models/aboutModel";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  await ConnectDB();
  const abouts = await About.find().sort({ createdAt: -1 });
  return NextResponse.json(abouts);
}

export async function POST(req) {
  try {
    await ConnectDB();
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category") || "Trending";
    const imageFile = formData.get("image");

    let imagePath = "";

    if (imageFile && typeof imageFile === "object" && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

      const uploadRes = await cloudinary.uploader.upload(base64, {
        folder: "about",
        public_id: uuidv4(),
      });

      imagePath = uploadRes.secure_url;
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
  } catch (error) {
    console.error("❌ About upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await ConnectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const formData = await req.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const imageFile = formData.get("image");

  let imagePath = "";

 
  if (imageFile && typeof imageFile === "object" && imageFile.name) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    const uploadRes = await cloudinary.uploader.upload(base64, {
      folder: "about",
      public_id: uuidv4(),
    });

    imagePath = uploadRes.secure_url;
  } else if (typeof imageFile === "string") {
    imagePath = imageFile;
  }

  const updateData = { title, description, category };
  if (imagePath) updateData.image = imagePath;

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
