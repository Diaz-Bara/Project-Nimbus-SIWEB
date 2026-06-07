"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FlightSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("query") || "");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    params.set("page", "1");
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Search flight number, route, or status..."
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white shadow-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
      >
        Search
      </button>
    </div>
  );
}
