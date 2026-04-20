"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Shipments", icon: "📦", path: "/shipments" },
    { name: "Tracking Logs", icon: "📄", path: "/tracking" },
    { name: "Flights", icon: "✈️", path: "/flights" },
    { name: "Users", icon: "👤", path: "/users" },
  ];

  return (
    <div
      className={`relative h-screen bg-white border-r p-4 transition-all duration-300 ease-in-out ${
        open ? "w-60" : "w-16"
      }`}
    >
      {/* LOGO */}
      <div className="flex items-center gap-2 mb-6">
        <Image src="/logo.png" alt="logo" width={30} height={30} />
        {open && (
          <h1 className="font-bold text-sm whitespace-nowrap">
            Nimbus <span className="text-orange-400">Cargo Express</span>
          </h1>
        )}
      </div>

      {/* MENU */}
      <ul className="space-y-2">
        {menu.map((item) => (
        <li
         key={item.path}
            className={`relative group flex items-center ${
             open ? "justify-start px-3" : "justify-center"
         } py-3 rounded-xl cursor-pointer w-full transition-all duration-200 ${
              pathname === item.path
             ? "bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-700"
             : "hover:bg-blue-100"
         }`}
        >
            <span className="text-lg">{item.icon}</span>

            {/* TEXT */}
            {open && <span>{item.name}</span>}

            {/* TOOLTIP (muncul saat collapse) */}
            {!open && (
              <span className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-1/2 -right-3 -translate-y-1/2 bg-white border shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:scale-105 transition"
      >
        <span
          className={`transform transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          ▶
        </span>
      </button>
    </div>
  );
}