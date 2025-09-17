

 import { cookies } from "next/headers";
 import { redirect } from "next/navigation";
 
 export default async function RootPage() {
   const cookieStore = await cookies();   // await lagao
   const token = cookieStore.get("token");
 
   if (token) {
     redirect("/admin");
   } else {
     redirect("/signup");
   }
 }
 