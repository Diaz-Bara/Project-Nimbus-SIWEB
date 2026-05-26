"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Shipment = {
  id: number;
  awb: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
};

type ShipmentFormProps = {
  data?: Shipment | null;
  onSave?: (shipment: any) => void;
};

export default function ShipmentForm({ data, onSave }: ShipmentFormProps) {
  const [form, setForm] = useState({
    awb: data?.awb || "",
    origin: data?.origin || "",
    destination: data?.destination || "",
    weight: data?.weight?.toString() || "",
    pieces: data?.pieces?.toString() || "",
    status: data?.status || "In-Transit",
  });

  const [isSaving, setIsSaving] = useState(false);
  
  // 🌟 State untuk efek loading form (Skeleton)
  const [isFormLoading, setIsFormLoading] = useState(true);

  // 🌟 Menahan tampilan form asli selama 1.5 detik saat halaman dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFormLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onSave) {
      onSave({
        id: data?.id ?? Date.now(),
        ...form,
        weight: Number(form.weight),
        pieces: Number(form.pieces),
      });
    }
    setIsSaving(false);
  };

  const handleClear = () => {
    setForm({
      awb: "", origin: "", destination: "", weight: "", pieces: "", status: "In-Transit",
    });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 min-h-[400px]">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        {data ? "Update Shipment" : "Create New Shipment"}
      </h2>

      {isFormLoading ? (
        /* 🌟 SKELETON LOADING UI */
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-full bg-gray-100 rounded border-b border-gray-200"></div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-start gap-4 mt-12">
            <div className="h-[42px] w-[150px] bg-gray-200 rounded-lg"></div>
            <div className="h-[42px] w-[80px] bg-gray-200 rounded-lg"></div>
            <div className="h-[42px] w-[80px] bg-gray-200 rounded-lg ml-auto"></div>
          </div>
        </div>
      ) : (
        /* FORM ASLI */
        <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Kolom Kiri */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AWB Number</label>
                <input
                  required
                  placeholder="RET-XXXX-XXX"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent transition-colors"
                  value={form.awb}
                  onChange={(e) => setForm({ ...form, awb: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  required
                  placeholder="Select destination"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent transition-colors"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (KG)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent transition-colors"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent transition-colors appearance-none cursor-pointer"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="" disabled>Select status</option>
                  <option value="In-Transit">In-Transit</option>
                  <option value="Pending QC">Pending QC</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                <input
                  required
                  placeholder="Select origin"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent transition-colors"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Level</label>
                <select className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent transition-colors appearance-none cursor-pointer">
                  <option>Express Priority</option>
                  <option>Standard Cargo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pieces</label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent transition-colors"
                  value={form.pieces}
                  onChange={(e) => setForm({ ...form, pieces: e.target.value })}
                />
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-4 mt-10">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#0a327d] hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium min-w-[150px] transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : data ? "Update Shipment" : "Save Shipment"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            
            <Link
              href="/shipments"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors ml-auto flex items-center justify-center"
            >
              Back
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}