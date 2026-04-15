"use client";

import { useState } from "react";

export default function TrackingForm() {
  const [awb, setAwb] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleTrack = () => {
    if (!awb) return alert("Masukkan nomor AWB!");

    // dummy result
    setResult("Paket sedang dalam perjalanan (Departed)");
  };

  return (
    <div className="max-w-xl mx-auto text-center">
      
      <h2 className="text-2xl font-bold mb-6">
        Tracking Pengiriman
      </h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Masukkan nomor AWB"
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-xl"
        />

        <button
          onClick={handleTrack}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Track
        </button>
      </div>

      {result && (
        <p className="mt-4 text-green-600 font-semibold">
          {result}
        </p>
      )}
    </div>
  );
}