import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { Metadata } from "next";

// 🌟 MENAMBAHKAN METADATA SESUAI UGD & CHAPTER 15
export const metadata: Metadata = {
  title: {
    template: "%s | Nimbus Cargo Express",
    default: "Nimbus Cargo Express - Precision Logistics",
  },
  description: "Sistem Informasi Cargo Darat, Udara, dan Laut terpercaya.",
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