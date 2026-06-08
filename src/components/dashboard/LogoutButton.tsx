"use client";

import { logoutAction } from "@/app/login/actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </form>
  );
}
