"use client";

import { useEffect, useState } from "react";
import { getTrackingByAwb } from "@/lib/actions";
import TrackingMap from "./TrackingMap";

type TrackingResult = {
  success: boolean;
  error?: string;
  shipment?: {
    awb: string;
    status: string;
    service_level: string;
    weight: number;
    price: number;
    origin: string;
    destination: string;
    recipient_name: string;
    sender_name?: string;
    item_type?: string;
    created_at?: string;
    updated_at?: string;
    shipping_date?: string;
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
    const timer = setTimeout(() => setIsPageLoading(false), 500);
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
            <div className="h-11 flex-1 bg-gray-200 rounded-lg" />
            <div className="h-11 w-24 bg-blue-300 rounded-lg" />
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Cargo Tracking</h2>
            <p className="text-gray-500 text-sm">Providing reliable global cargo transportation through an integrated logistics network, real-time shipment visibility, optimized routing, and operational excellence.</p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 w-full max-w-xl mb-4">
            <input
              type="text"
              placeholder="Enter AWB Number (e.g. AWB-001)"
              className="flex-1 border border-blue-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium min-w-[100px] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isSearching ? "..." : "Track"}
            </button>
          </form>

          {result && !result.success && (
            <p className="text-red-600 font-semibold mt-2 text-sm bg-red-50 py-2 px-4 rounded-md border border-red-100">{result.error}</p>
          )}

          {result?.success && result.shipment && (
            <div className="w-full max-w-3xl mt-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
                  <div>
                    <p className="text-xs text-gray-400 font-medium tracking-wider mb-1">AIR WAYBILL</p>
                    <h3 className="text-2xl font-bold text-blue-900">{result.shipment.awb}</h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700 border border-blue-100">
                      {result.shipment.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">Last updated: {result.shipment.updated_at ? new Date(result.shipment.updated_at).toLocaleDateString("en-US") : "N/A"}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm mb-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Origin</p>
                    <p className="font-semibold text-gray-800">{result.shipment.origin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Destination</p>
                    <p className="font-semibold text-gray-800">{result.shipment.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Service Level</p>
                    <p className="font-semibold text-gray-800">{result.shipment.service_level}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Weight</p>
                    <p className="font-semibold text-gray-800">{result.shipment.weight} KG</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Price</p>
                    <p className="font-semibold text-gray-800">Rp {(result.shipment.price || 0).toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Cargo Type</p>
                    <p className="font-semibold text-gray-800">{result.shipment.item_type || "General Cargo"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Sender</p>
                    <p className="font-semibold text-gray-800">{result.shipment.sender_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Recipient</p>
                    <p className="font-semibold text-gray-800">{result.shipment.recipient_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Shipping Date</p>
                    <p className="font-semibold text-gray-800">{result.shipment.shipping_date ? new Date(result.shipment.shipping_date).toLocaleDateString("en-US") : "-"}</p>
                  </div>
                </div>
              </div>

              <TrackingMap origin={result.shipment.origin} destination={result.shipment.destination} status={result.shipment.status} />

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
                <h4 className="text-sm font-bold text-gray-800 mb-5 tracking-wider uppercase border-b border-gray-100 pb-3">Tracking History</h4>
                <div className="space-y-6">
                  {(result.history || []).length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No tracking history available yet.</p>
                  ) : (
                    (result.history || []).map((item, index) => (
                      <div key={`${item.status}-${index}`} className="flex gap-4 relative">
                        {index !== (result.history || []).length - 1 && (
                          <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-blue-100" />
                        )}
                        <div className="mt-1 h-6 w-6 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 gap-1">
                            <p className="font-bold text-gray-800">{item.status}</p>
                            <p className="text-xs font-medium text-gray-400">
                              {item.created_at ? new Date(item.created_at).toLocaleString("en-US") : "-"}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600"><span className="font-medium">{item.location}</span> &mdash; {item.note}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
