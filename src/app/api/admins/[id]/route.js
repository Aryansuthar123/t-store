import { NextResponse } from "next/server";
import connectDB from "../../../utils/database";
import Admin from "@/models/Admin";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";


export async function DELETE(req, context) {
  await connectDB();

        try {
          const { id } = await context.params;

          const deleted = await Admin.findByIdAndDelete(id);

          if (!deleted) {
            return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
          }

          return NextResponse.json({ success: true, message: "Admin deleted" });
        } catch (error) {
          return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

}

export async function GET(req, context) {
      await connectDB();
      try {
        const { id } = await context.params; 
        const admin = await Admin.findById(id).select("name email image");

            if (!admin) {
              return NextResponse.json(
                { success: false, message: "Admin not found" },
                { status: 404 }
              );
            } 

            return NextResponse.json({ success: true, admin });
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

    const name = formData.get("name");
    const email = formData.get("email");
    const image = formData.get("image");

      console.log("Received formData:", { name, email,  image });

    let imageUrl = null;

    if (image && image.size > 0) {
   const bytes = await image.arrayBuffer();
   const buffer = Buffer.from(bytes);

   const uploadDir = path.join(process.cwd(), "public/uploads");
   const filePath = path.join(uploadDir, image.name);

   await writeFile(filePath, buffer);

   imageUrl = `/uploads/${image.name}`;  
}

    const updateData = {
      name,
      email
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }


        const edit = await Admin.findByIdAndUpdate(id , updateData , {new: true});

        if (!edit) {
          return NextResponse.json(
            { success: false, message: "Admin not found" },
            { status: 404 });
        }

        return NextResponse.json(
          { success: true,  message: "Admin edited" , admin: edit, });
      } catch (error) {
          console.error("PUT /api/admins error:", error);
          return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }

    }
