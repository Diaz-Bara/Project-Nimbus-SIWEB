"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideRoutes = ["/dashboard", "/login", "/register", "/TrackingAdmin", "/tracking", "/shipments", "/flights", "/users"];

  const hideLayout = hideRoutes.some((route) => pathname.includes(route));

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