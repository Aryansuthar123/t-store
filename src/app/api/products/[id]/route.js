import connectDB from "../../../utils/database";
import Product from "../../../../models/Prodect";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  await connectDB();
  try {
    const { id } =  context.params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(req, context) {
  await connectDB();
  try {
    const { id } = context.params;
    const formData = await req.formData();

    const title = formData.get("title");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const description = formData.get("description");
    const featureImage = formData.get("featureImage");

    let imageUrl = null;

    if (featureImage && featureImage.size > 0) {
      const bytes = await featureImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${uuidv4()}-${featureImage.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    const updateData = {
      title,
      price,
      stock,
      description,
    };

    if (imageUrl) {
      updateData.featureImage = imageUrl;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated",
      product: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
