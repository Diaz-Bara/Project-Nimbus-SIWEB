import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/TrackingAdmin",
  "/flights",
  "/shipments",
  "/users",
  "/query",
];

const adminOnlyRoutes = ["/shipments", "/users"];

const legacyRedirects: Record<string, string> = {
  "/tracking/awb-tidak-ditemukan": "/tracking/awb-not-found",
  "/TrackingAdmin/awb-tidak-ditemukan": "/TrackingAdmin/awb-not-found",
  "/Tentang": "/about",
  "/Layanan": "/services",
  "/Klien": "/clients",
  "/Kontak": "/contact",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacyTarget = legacyRedirects[pathname];
  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, request.url), 308);
  }
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminOnlyRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));
  const user = request.cookies.get("app_user")?.value;
  const role = request.cookies.get("app_role")?.value;

  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminOnlyRoute && role !== "admin") {
    const forbiddenUrl = new URL("/forbidden", request.url);
    forbiddenUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(forbiddenUrl);
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};