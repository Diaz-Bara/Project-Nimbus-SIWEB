import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import Providers from "@/components/layout/Providers";
import { Metadata } from "next";

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
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
