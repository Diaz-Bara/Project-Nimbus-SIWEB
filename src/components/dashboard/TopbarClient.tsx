"use client";

import { useEffect, useState } from "react";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export default function TopbarClient() {
  const [user, setUser] = useState("Guest");
  const [role, setRole] = useState("guest");

  useEffect(() => {
    setUser(readCookie("app_user") || "Guest");
    setRole(readCookie("app_role") || "guest");
  }, []);

  return (
    <div className="w-full flex justify-end items-center">
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <p className="font-semibold">{user}</p>
          <p className="text-xs uppercase text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}