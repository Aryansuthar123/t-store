// import connectDB from "../../../../utils/database";
// import User from "../../../../../models/userModel";
// import { NextResponse } from "next/server";

// export async function PATCH(req, { params }) {
//   await connectDB();
//   const { id } = params;
//   const { isApproved } = await req.json();

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { isApproved },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, user: updatedUser });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: error.message || "Error updating user" },
//       { status: 500 }
//     );
//   }
// }



import connectDB from "../../../../utils/database";
import User from "../../../../../models/userModel";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    if (typeof body.isApproved !== "boolean") {
      return NextResponse.json({ error: "isApproved must be boolean" }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(id, { isApproved: body.isApproved }, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("Approve API error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

