"use client";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideRoutes = ["/dashboard", "/login", "/register", "/TrackingAdmin", "/tracking", "/shipments", "/flights", "/users"];

  const hideLayout = hideRoutes.some((route) =>
    pathname.includes(route)
  );

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">

        {!hideLayout && <Navbar />}

        <main className="flex-1">
          {children}
        </main>

        {!hideLayout && <Footer />}

      </body>
    </html>
  );
}