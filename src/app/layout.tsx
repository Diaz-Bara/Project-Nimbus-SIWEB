import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { Metadata } from "next";

// 🌟 MENAMBAHKAN METADATA SESUAI UGD & CHAPTER 15
export const metadata: Metadata = {
  title: {
    template: "%s | Nimbus Cargo Express",
    default: "Nimbus Cargo Express - Precision Logistics",
  },
  description: "Trusted land, air, and sea cargo information system.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Memanggil wrapper client untuk menyembunyikan Navbar/Footer */}
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}