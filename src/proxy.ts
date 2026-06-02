import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/TrackingAdmin",
  "/tracking",
  "/flights",
  "/shipments",
  "/users",
];

const adminOnlyRoutes = ["/shipments", "/users"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminOnlyRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));
  const user = request.cookies.get("app_user")?.value;
  const role = request.cookies.get("app_role")?.value;

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminOnlyRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
