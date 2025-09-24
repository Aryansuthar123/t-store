import Product from "../../models/Prodect";
import { NextResponse } from "next/server";

export async function getProducts() {
  try {
    const products = await Product.find();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function createProduct(req) {
  try {
    const body = await req.json();
    console.log("Incoming Body:", body);
    const newProduct = await Product.create(body);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Product creation failed:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
