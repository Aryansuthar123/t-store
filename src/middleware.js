// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log("🧠 MIDDLEWARE TRIGGERED:", pathname, "TOKEN:", token ? "YES" : "NO");

  // ✅ Public routes (login, forgot-password, verify-otp, reset-password)
 const publicAdminRoutes = [
  "/admin-login",
  "/admin/forgot-password",
  "/admin/verify-otp",
  "/admin/reset-password",
];


  if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
    console.log("✅ PUBLIC ROUTE:", pathname);
    return NextResponse.next();
  }

  // 🚫 Protect only /admin pages
  if (pathname.startsWith("/admin") && !token) {
    console.log("🚫 NO TOKEN — redirecting to /admin-login");
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
