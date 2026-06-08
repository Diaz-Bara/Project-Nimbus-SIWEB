"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function shouldHidePublicLayout(pathname: string): boolean {
  if (pathname.startsWith("/tracking/awb-not-found")) {
    return false;
  }

  const hideRoutes = [
    "/dashboard",
    "/login",
    "/register",
    "/TrackingAdmin",
    "/tracking",
    "/shipments",
    "/flights",
    "/users",
    "/forbidden",
  ];

  return hideRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = shouldHidePublicLayout(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}