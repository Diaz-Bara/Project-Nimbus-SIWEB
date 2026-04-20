"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const menu = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Shipments", icon: "📦", path: "/shipments" },
    { name: "Tracking Logs", icon: "📄", path: "/TrackingAdmin" },
    { name: "Flights", icon: "✈️", path: "/flights" },
    { name: "Users", icon: "👤", path: "/users" },
  ];

  return (
    <div
      className={`relative h-screen transition-all duration-300 ease-in-out
      ${open ? "w-64" : "w-20"}
      
      bg-white/70 backdrop-blur-xl border-r border-white/20 shadow-lg`}
    >

      {/*  LOGO */}
      <div className="flex items-center gap-3 px-4 pt-5 mb-8">

        <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl shadow">
          <Image src="/logo.png" alt="logo" width={26} height={26} />
        </div>

        {open && (
          <div className="leading-tight">
            <h1 className="text-sm font-bold italic text-blue-900">
              NIMBUS <span className="text-orange-400">CARGO</span>
            </h1>
            <h2 className="text-sm font-bold italic text-orange-400">
              EXPRESS
            </h2>
            <p className="text-[10px] tracking-widest text-gray-400 mt-1">
              PRECISION LOGISTICS
            </p>
          </div>
        )}
      </div>

      {/*  MENU */}
      <ul className="space-y-2 px-2">
        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <li
                className={`
                  group relative flex items-center cursor-pointer
                  ${open ? "px-4 justify-start" : "justify-center"}
                  py-3 rounded-xl transition-all duration-300
                  
                  ${active
                    ? "bg-blue-500/20 text-blue-700 backdrop-blur-md shadow-inner"
                    : "hover:bg-white/50 hover:backdrop-blur-md"}
                `}
              >
                {/* ICON */}
                <span className="text-lg">{item.icon}</span>

                {/* TEXT */}
                {open && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}

                {/* ACTIVE INDICATOR */}
                {active && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-full"></div>
                )}

                {/* TOOLTIP */}
                {!open && (
                  <span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </li>
            </Link>
          );
        })}
      </ul>

      {/*  TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-1/2 -right-3 -translate-y-1/2 
        bg-white/80 backdrop-blur-md border shadow-md 
        rounded-full w-9 h-9 flex items-center justify-center 
        hover:scale-110 transition"
      >
        <span
          className={`transform transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▶
        </span>
      </button>

      {/*  LOGOUT */}
      <div className="absolute bottom-6 w-full px-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3
          bg-red-500/90 hover:bg-red-600 text-white py-3 rounded-2xl
          font-semibold shadow-lg backdrop-blur-md
          transition-all duration-300 hover:scale-[1.02]"
        >
          <span className="text-lg">↩</span>
          {open && <span>Logout</span>}
        </button>
      </div>

    </div>
  );
}