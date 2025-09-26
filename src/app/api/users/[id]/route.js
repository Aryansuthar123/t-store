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

// /**
//  * PUT  →  User ko update karega (username, email, image)
//  *         FormData ke sath image string bhi handle karega
//  */
// export async function PUT(req, context) {
//   await connectDB();
//   try {
//     const params = await context.params;          // ✅ await karo
//     const form = await req.formData();

//     const username = form.get("username");
//     const email    = form.get("email");
//     const image    = form.get("image");           // base64 ya URL string

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

// /**
//  * DELETE → User ko id se delete karega
//  */
// export async function DELETE(req, context) {
//   await connectDB();
//   try {
//     const params = await context.params;          // ✅ await karo
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
