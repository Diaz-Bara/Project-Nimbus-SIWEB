"use client";
import { useState } from "react";
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
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        {data ? "Update Shipment" : "Create New Shipment"}
      </h2>

      <form onSubmit={handleSubmit}>
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
            className="bg-[#0a327d] hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium min-w-[150px] transition-colors disabled:opacity-70"
          >
            {isSaving ? "Processing..." : data ? "Update Shipment" : "Save Shipment"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          
          {/* Tombol kembali tambahan agar user bisa batal tanpa menghapus data */}
          <Link
            href="/shipments"
            className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center ml-auto"
          >
            ← Back to Table
          </Link>
        </div>
      </form>
    </div>
  );
}