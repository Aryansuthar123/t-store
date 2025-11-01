import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log("🧠 MIDDLEWARE TRIGGERED:", pathname, "TOKEN:", token ? "YES" : "NO");

  const publicAdminRoutes = [
    "/admin/forgot-password",
    "/admin/reset-password",
    "/admin-login",
  ];

  // ✅ Allow verification and API routes without blocking
  if (pathname.startsWith("/api/users/verify-email")) {
    console.log("✅ SKIPPING VERIFY EMAIL API");
    return NextResponse.next();
  }

  // ✅ Allow public admin routes
  if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
    console.log("✅ PUBLIC ROUTE:", pathname);
    return NextResponse.next();
  }

  // 🚫 Protect only /admin pages
  if (pathname.startsWith("/admin") && !token) {
    console.log("🚫 NO TOKEN — redirecting to /admin-login");
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  console.log("✅ ALLOWED ROUTE:", pathname);
  return NextResponse.next();
}

// ✅ Matcher: apply middleware only to admin routes
export const config = {
  matcher: [
    "/admin",
    "/admin/",
    "/admin/:path((?!login|forgot-password|reset-password).*)",
  ],
};
