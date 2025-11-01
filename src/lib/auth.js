// // src/lib/auth.js
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import User from "../models/userModel";
// import connectDB from "@/app/utils/database";

// // ye function async hona chahiye
// export async function getCurrentUser() {
//   await connectDB();

//   // await cookies() use karo
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) return null;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).lean();
//     return user || null;
//   } catch (err) {
//     console.error("Auth decode error:", err);
//     return null;
//   }
// }
