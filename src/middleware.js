import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/admin&adminLogin=true", req.url));
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      if (!decoded.isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login?redirect=/admin&adminLogin=true", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
