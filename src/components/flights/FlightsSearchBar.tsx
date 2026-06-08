"use client";

import Search from "@/components/search";

export default function FlightsSearchBar({
  placeholder,
}: {
  placeholder: string;
}) {
  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="flex-1">
        <Search placeholder={placeholder} />
      </div>
      <button
        type="button"
        className="bg-[#0a327d] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        onClick={() => {
          const input = document.getElementById("search") as HTMLInputElement | null;
          input?.focus();
        }}
      >
        Search
      </button>
    </div>
  );
}