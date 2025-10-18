import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

export function middleware() {
  // const token = req.cookies.get("token")?.value;
  // const { pathname } = req.nextUrl;

  // // ❌ Skip middleware for login page
  // if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
  //   if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  //   try {
  //     const secret = process.env.TOKEN_SECRET || "dev_secret_key";
  //     const decoded = jwt.verify(token, secret);
  //     if (!decoded.isAdmin) return NextResponse.redirect(new URL("/", req.url));
      //return NextResponse.next();
    // } catch (err) {
    //   return NextResponse.redirect(new URL("/admin/login", req.url));
    //}
  

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
