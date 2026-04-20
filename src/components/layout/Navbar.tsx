"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const menu = [
    { name: "Beranda", path: "/" },
    { name: "Tentang", path: "/Tentang" },
    { name: "Layanan", path: "/Layanan" },
    { name: "Klien", path: "/Klien" },
    { name: "Kontak", path: "/Kontak" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
      
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <h1 className="font-bold whitespace-nowrap">
          Nimbus <span className="text-orange-400">Cargo Express</span>
        </h1>
      </div>

      <div className="flex gap-6">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`transition ${
              pathname === item.path
                ? "text-orange-400 font-semibold"
                : "text-gray-700 hover:text-orange-400"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <Link href="/login">
         <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
          Login
        </button>
      </Link>
    </nav>
  );
}