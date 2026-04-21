"use client";

export default function Topbar() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  return (
    <div className="flex justify-between items-center">

      {/* SEARCH */}
      <input
        placeholder="Search..."
        className="w-1/2 border rounded-xl px-4 py-2 text-sm"
      />

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* ROLE */}
        {/* <span className="text-sm font-medium text-gray-600">
          {user?.role === "admin" ? "Admin" : "Operator"}
        </span> */}

        {/* USER INFO */}
        <div className="text-right text-sm">
          <p className="font-semibold">{user?.email} 👤</p>
        </div>

      </div>
    </div>
  );
}