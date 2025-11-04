// import { NextResponse } from "next/server";
// import ConnectDB from "../../../utils/database";
// import User from "../../../../models/userModel";
// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     await ConnectDB();
//     const { email } = await req.json();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" });
//     }

//     // 🔢 Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.resetOTP = otp;
//     user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
//     await user.save();

//     console.log("✅ OTP Saved in DB:", otp);

//     // 📧 Email config
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"T-Store" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP for Password Reset",
//       text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
//     };

//     await transporter.sendMail(mailOptions);

//     console.log("📧 OTP sent successfully to:", email);

//     return NextResponse.json({ success: true, message: "OTP sent to your email" });
//   } catch (error) {
//     console.error("🔥 Error sending OTP:", error);
//     return NextResponse.json({ success: false, message: "Error sending OTP" }, { status: 500 });
//   }
// }
