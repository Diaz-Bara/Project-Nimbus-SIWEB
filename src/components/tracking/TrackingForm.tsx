"use client";

import { useEffect, useState } from "react";
import { getTrackingByAwb } from "@/lib/actions";

type TrackingResult = {
  success: boolean;
  error?: string;
  shipment?: {
    awb: string;
    status: string;
    service_level: string;
    weight: number;
    pieces: number;
    origin: string;
    destination: string;
    recipient_name: string;
  };
  history?: {
    status: string;
    location: string;
    note: string;
    created_at: string;
  }[];
};

export default function TrackingForm() {
  const [awb, setAwb] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awb.trim()) {
      setResult({ success: false, error: "Masukkan nomor AWB terlebih dahulu." });
      return;
    }

    setIsSearching(true);
    const tracking = await getTrackingByAwb(awb.trim());
    setResult(tracking as TrackingResult);
    setIsSearching(false);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {isPageLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse w-full max-w-lg">
          <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
          <div className="flex gap-2 w-full">
            <div className="h-11 flex-1 bg-gray-200 rounded-lg border border-blue-200" />
            <div className="h-11 w-24 bg-blue-300 rounded-lg" />
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Tracking Pengiriman</h2>

          <form onSubmit={handleTrack} className="flex gap-2 w-full max-w-lg mb-4">
            <input
              type="text"
              placeholder="Masukkan nomor AWB"
              className="flex-1 border border-blue-500 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium min-w-[90px] disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isSearching ? "..." : "Track"}
            </button>
          </form>

          {result && !result.success && (
            <p className="text-red-600 font-semibold mt-2 text-sm">{result.error}</p>
          )}

          {result?.success && result.shipment && (
            <div className="w-full max-w-2xl mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b pb-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">AWB</p>
                  <h3 className="text-lg font-bold text-blue-900">{result.shipment.awb}</h3>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {result.shipment.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm mb-5">
                <p>Origin: <span className="font-semibold">{result.shipment.origin}</span></p>
                <p>Destination: <span className="font-semibold">{result.shipment.destination}</span></p>
                <p>Recipient: <span className="font-semibold">{result.shipment.recipient_name}</span></p>
                <p>Service: <span className="font-semibold">{result.shipment.service_level}</span></p>
                <p>Weight: <span className="font-semibold">{result.shipment.weight} KG</span></p>
                <p>Pieces: <span className="font-semibold">{result.shipment.pieces}</span></p>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-400">TRACKING HISTORY</p>
                {(result.history || []).map((item, index) => (
                  <div key={`${item.status}-${index}`} className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.status}</p>
                      <p className="text-xs text-gray-500">{item.location} - {item.note}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : "-"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
