// import { NextResponse } from "next/server";
// import User from "../../../../models/userModel";
// import ConnectDB from "../../../../utils/database";
// import bcryptjs from "bcryptjs";

// export async function POST(req) {
//   try {
//     await ConnectDB();
//     const { email, token, newPassword } = await req.json();

//     if (!email || !token || !newPassword) {
//       return NextResponse.json({ success: false, message: "Missing fields" });
//     }

//     const user = await User.findOne({
//       email,
//       forgotPasswordToken: token,
//       forgotPasswordTokenExpiry: { $gt: Date.now() },
//     });

//     if (!user) {
//       return NextResponse.json({
//         success: false,
//         message: "Invalid or expired token",
//       });
//     }

//     // ✅ Hash new password
//     const hashedPassword = await bcryptjs.hash(newPassword, 10);

//     user.password = hashedPassword;
//     user.forgotPasswordToken = undefined;
//     user.forgotPasswordTokenExpiry = undefined;

//     await user.save();

//     return NextResponse.json({
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     return NextResponse.json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// }
