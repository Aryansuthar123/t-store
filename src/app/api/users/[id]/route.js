// import connectDB from "../../../utils/database";
// import User from "../../../../models/userModel";
// import { NextResponse } from "next/server";


// export async function GET(req, context) {
//   await connectDB();
//   try {
//     const params = await context.params;          
//     const user = await User.findById(params.id);

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, user });
//   } catch (err) {
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }


//   User ko update karega (username, email, image)
    //  FormData ke sath image string bhi handle karega

// export async function PUT(req, context) {
//   await connectDB();
//   try {
//     const params = await context.params;         
//     const form = await req.formData();

//     const username = form.get("username");
//     const email    = form.get("email");
//     const image    = form.get("image");         
//     const updatedUser = await User.findByIdAndUpdate(
//       params.id,
//       { username, email, image },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, user: updatedUser });
//   } catch (err) {
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }


// DELETE → User ko id se delete karega

// export async function DELETE(req, context) {
//   await connectDB();
//   try {
//     const params = await context.params;          
//     await User.findByIdAndDelete(params.id);

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }




import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";


export async function GET(req, context) {
  await connectDB();
  try {
    const { id } = await context.params;
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  await connectDB();
  try {
    const { id } = await context.params;
    const form = await req.formData();

    const username = form.get("username");
    const email    = form.get("email");
    const image    = form.get("image"); 

    const updateData = { username, email };

     if (image && typeof image !== "string") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filepath, buffer);
      updateData.image = `/uploads/${filename}`; 
    }

    if (image && typeof image === "string") updateData.image = image;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await connectDB();
  try {
    const { id } = await context.params;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}






