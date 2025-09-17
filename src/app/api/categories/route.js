import connectDB from "../../utils/database";
import Category from "@/Models/Category";
import Product from "../../../models/Prodect";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

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

    // ✅ image ko server pe save karo (public/uploads)
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, image.name);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${image.name}`; // ✅ sirf path DB me store hoga

    // ✅ Category create
    const newCategory = await Category.create({
      name,
      slug,
      image: imageUrl,
    });

    // ✅ Linked Product bhi create karo
    const newProduct = await Product.create({
      title: name,
      description: `${name} auto-generated product`,
      category: name,
      price: 0,
      image: imageUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Category and linked Product created",
      category: newCategory,
      product: newProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
