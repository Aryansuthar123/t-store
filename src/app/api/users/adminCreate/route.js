// export async function POST(req) {
//   await connectDB();
//   const formData = await req.formData();
//   const username = formData.get("username");
//   const email = formData.get("email");
//   const password = "123456"; 
//   const image = formData.get("image"); 

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newAdmin = await User.create({
//     username,
//     email,
//     password: hashedPassword,
//     isAdmin: true,
//     isApproved: true,
//     image,
//   });

//   return NextResponse.json({ success: true, admin: newAdmin });
// }
