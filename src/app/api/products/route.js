// import connectDB from "../../utils/database";
// import {createProduct, getProducts} from "../../controllers/product"

// // http://localhost:3000/api/products
// export async function POST(req){
//     await connectDB();
//     return createProduct(req);
// }
// // http://localhost:3000/api/products
// export async function GET(req) {
//     await connectDB(); 
//     return getProducts();
// }



import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import connectDB from "../../utils/database"; 


export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, products });
}


export async function POST(req) {
  await connectDB();
  try {
    const form = await req.formData();

  
    const title            = form.get("title");
    const shortDescription = form.get("shortDescription");
    const description      = form.get("description");
    const category         = form.get("category");
    const stock            = Number(form.get("stock") || 0);
    const price            = Number(form.get("price") || 0);
    const salePrice        = form.get("salePrice") ? Number(form.get("salePrice")) : undefined;

    const featureImage     = form.get("featureImage");
    let featureImageUrl    = "";
    if (featureImage && featureImage.size > 0) {
      const bytes    = await featureImage.arrayBuffer();
      const buffer   = Buffer.from(bytes);
      const filename = `${uuidv4()}-${featureImage.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filePath, buffer);
      featureImageUrl = `/uploads/${filename}`;
    }

    
    const galleryImages = form.getAll("images");
    const imageUrls     = [];
    for (const img of galleryImages) {
      if (img && img.size > 0) {
        const bytes    = await img.arrayBuffer();
        const buffer   = Buffer.from(bytes);
        const filename = `${uuidv4()}-${img.name}`;
        const filePath = path.join(process.cwd(), "public", "uploads", filename);
        await writeFile(filePath, buffer);
        imageUrls.push(`/uploads/${filename}`);
      }
    }

    const product = await Product.create({
      title,
      shortDescription,
      description,
      category,
      stock,
      price,
      salePrice,
      featureImage: featureImageUrl,
      images: imageUrls
    });

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("createProduct error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// import { serve } from "inngest/next";
// import { inngest, syncUserCreation, syncUserUpdation, syncUserDeletion } from "@/Config/inngest";

// // Create an API that serves zero functions
// export const { GET, POST, PUT } = serve({
//   client: inngest,
//   functions: [
//      syncUserCreation, 
//      syncUserUpdation, 
//      syncUserDeletion
//   ],
// });