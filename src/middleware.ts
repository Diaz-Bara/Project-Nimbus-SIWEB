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

const legacyRedirects: Record<string, string> = {
  "/Tentang": "/about",
  "/Layanan": "/services",
  "/Klien": "/clients",
  "/Kontak": "/contact",
  "/tracking/awb-tidak-ditemukan": "/tracking/awb-not-found",
  "/TrackingAdmin/awb-tidak-ditemukan": "/TrackingAdmin/awb-not-found",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacyTarget = legacyRedirects[pathname];
  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, request.url), 308);
  }

  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
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
    "/Tentang",
    "/Layanan",
    "/Klien",
    "/Kontak",
    "/tracking/awb-tidak-ditemukan",
    "/TrackingAdmin/awb-tidak-ditemukan",
  ],
};