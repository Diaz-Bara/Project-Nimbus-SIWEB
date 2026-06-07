import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "nimbus_session";

const protectedRoutes = [
  "/dashboard",
  "/users",
  "/shipments",
  "/flights",
  "/TrackingAdmin",
  "/query",
];

const authRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If accessing protected route without session, redirect to login
  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login page with session, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    const dashUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/shipments/:path*",
    "/flights/:path*",
    "/TrackingAdmin/:path*",
    "/query/:path*",
    "/login",
  ],
};
