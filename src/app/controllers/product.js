// import Product from "../../models/Product";
// import { NextResponse } from "next/server";
// import { writeFile } from "fs/promises";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";

// export async function getProducts() {
//   try {
//     const products = await Product.find();
//     return NextResponse.json({ success: true, products });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
// export async function createProduct(req) {
//   try {
//     const form = await req.formData();

//     const title = form.get("name");  
//     const price = form.get("price");
//     const description = form.get("description");
//     const category = form.get("category");
//     const featureImage = form.get("featureImage"); 
//     const galleryImages = form.getAll("images");   

//     let featureImageUrl = null;
//     if (featureImage && featureImage.size > 0) {
//       const bytes = await featureImage.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const filename = `${uuidv4()}-${featureImage.name}`;
//       const filePath = path.join(process.cwd(), "public", "uploads", filename);
//       await writeFile(filePath, buffer);
//       featureImageUrl = `/uploads/${filename}`;
//     }

//     // Save gallery images
//     const imageUrls = [];
//     for (const img of galleryImages) {
//       if (img && img.size > 0) {
//         const bytes = await img.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const filename = `${uuidv4()}-${img.name}`;
//         const filePath = path.join(process.cwd(), "public", "uploads", filename);
//         await writeFile(filePath, buffer);
//         imageUrls.push(`/uploads/${filename}`);
//       }
//     }

//     const product = await Product.create({
//       title,
//       price,
//       description,
//       category,
//       featureImage: featureImageUrl,
//       images: imageUrls,
//     });

//     return NextResponse.json({ success: true, product });
//   } catch (error) {
//     console.error("createProduct error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }