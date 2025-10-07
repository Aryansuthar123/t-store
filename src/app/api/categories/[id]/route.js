import { NextResponse } from "next/server";
import connectDB from "../../../utils/database";
import Category from "../../../../models/Category";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";


export async function DELETE(req, context) {
  await connectDB();

        try {
          const { id } = await context.params;

          const deleted = await Category.findByIdAndDelete(id);

          if (!deleted) {
            return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
          }

          return NextResponse.json({ success: true, message: "Category deleted" });
        } catch (error) {
          return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
}

export async function GET(req, context) {
      await connectDB();
      try {
        const { id } = await context.params; 
        const category = await Category.findById(id).select("name slug image");

            if (!category) {
              return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
              );
            }

            return NextResponse.json({ success: true, category });
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
    const { id } =  await context.params;
    const formData = await req.formData();

    const name = formData.get("name");
    const slug = formData.get("slug");
    const imageFile = formData.get("image");

      console.log("Received formData:", { name, slug, imageFile });

    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${uuidv4()}-${imageFile.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
      console.log("Image saved at:", imageUrl);
    }

    const updateData = {
      name,
      slug,
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }


        const edit = await Category.findByIdAndUpdate(id , updateData , {new: true});

        if (!edit) {
          return NextResponse.json(
            { success: false, message: "Category not found" },
            { status: 404 });
        }

        return NextResponse.json(
          { success: true, 
            message: "Category edited" ,
            category: edit, });
      } catch (error) {
          console.error("PUT /api/categories error:", error);
          return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

    }
