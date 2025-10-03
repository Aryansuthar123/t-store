
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/app/utils/database";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";


export async function GET(_, { params }) {
  await connectDB();
  console.log("params =>", params);
  const { id } = params;
  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json(
      { success: false, message: "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, product });
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const formData = await req.formData();


    const title = formData.get("title");
    const shortDescription = formData.get("shortDescription");
    const description = formData.get("description");
    const category = formData.get("category");
    const stock = formData.get("stock");
    const price = formData.get("price");
    const salePriceRaw = formData.get("salePrice");
    const salePrice =
      salePriceRaw !== null && salePriceRaw !== "" ? Number(salePriceRaw) : null;


    let featureImageUrl = null;
    const featureImage = formData.get("featureImage");
    if (featureImage && featureImage.size > 0) {
      const bytes = await featureImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${uuidv4()}-${featureImage.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      await writeFile(filePath, buffer);
      featureImageUrl = `/uploads/${fileName}`;
    }

    const images = [];
    for (const file of formData.getAll("images")) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        await writeFile(filePath, buffer);
        images.push(`/uploads/${fileName}`);
      }
    }


    const updateData = {
      title,
      shortDescription,
      description,
      category,
      stock: Number(stock ?? 0),
      price: Number(price ?? 0),
      salePrice:
        salePriceRaw !== null && salePriceRaw !== "" ? Number(salePriceRaw) : null,
    };

    if (featureImageUrl) updateData.featureImage = featureImageUrl;
    if (images.length > 0) updateData.images = images;


    const updated = await Product.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
export async function DELETE(_, { params }) {
  await connectDB();
  try {
    const { id } = params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
