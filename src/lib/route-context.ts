const DASHBOARD_PREFIXES = [
  "/dashboard",
  "/TrackingAdmin",
  "/flights",
  "/shipments",
  "/users",
  "/forbidden",
];

const AUTH_PREFIXES = ["/login", "/register"];

export type AppRouteContext = "dashboard" | "auth" | "public";

export function getRouteContext(pathname: string): AppRouteContext {
  if (AUTH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return "auth";
  }

  if (DASHBOARD_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return "dashboard";
  }

  return "public";
}

export function isDashboardPath(pathname: string): boolean {
  return getRouteContext(pathname) === "dashboard";
}