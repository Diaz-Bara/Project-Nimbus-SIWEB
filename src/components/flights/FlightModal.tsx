"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveFlight, deleteFlightAction } from "@/lib/flight-actions";

type Flight = {
  id: number;
  code: string;
  aircraft: string;
  origin_code: string;
  origin_city: string;
  destination_code: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  progress: number;
  capacity_tons: number;
  used_tons: number;
};

export default function FlightModal({
  isOpen,
  onClose,
  data,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: Flight | null;
  mode: "create" | "edit" | "detail";
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    aircraft: "",
    origin_code: "",
    origin_city: "",
    destination_code: "",
    destination_city: "",
    departure_time: "08:00",
    arrival_time: "10:00",
    status: "ACTIVE",
    capacity_tons: 0,
  });

  useEffect(() => {
    if (data) {
      setForm({
        code: data.code || "",
        aircraft: data.aircraft || "",
        origin_code: data.origin_code || "",
        origin_city: data.origin_city || "",
        destination_code: data.destination_code || "",
        destination_city: data.destination_city || "",
        departure_time: data.departure_time || "08:00",
        arrival_time: data.arrival_time || "10:00",
        status: data.status || "ACTIVE",
        capacity_tons: data.capacity_tons || 0,
      });
    } else {
      setForm({
        code: "",
        aircraft: "",
        origin_code: "",
        origin_city: "",
        destination_code: "",
        destination_city: "",
        departure_time: "08:00",
        arrival_time: "10:00",
        status: "ACTIVE",
        capacity_tons: 0,
      });
    }
    setError(null);
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await saveFlight(form, mode === "edit" ? data?.id : undefined);

    if (result.success) {
      onClose();
      router.refresh();
    } else {
      setError(result.error || "Failed to save flight.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!data) return;
    setDeleting(true);
    const result = await deleteFlightAction(data.id);
    if (result.success) {
      onClose();
      router.refresh();
    } else {
      setError(result.error || "Failed to delete flight.");
      setDeleting(false);
    }
  };

  const statusColor = (s: string) => {
    const st = s?.toLowerCase() || "";
    if (st === "active") return "bg-green-100 text-green-700";
    if (st.includes("delay")) return "bg-orange-100 text-orange-700";
    if (st === "completed") return "bg-blue-100 text-blue-700";
    if (st.includes("cancel")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {mode === "create" ? "New Flight" : mode === "edit" ? "Edit Flight" : "Flight Detail"}
            </h2>
            {data && (
              <p className="text-sm text-gray-400 mt-0.5">{data.code} — {data.aircraft}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Detail Mode */}
        {mode === "detail" && data && (
          <div className="p-6 space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(data.status)}`}>{data.status}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Aircraft</p>
                <p className="text-sm font-medium text-gray-800">{data.aircraft}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Origin</p>
                <p className="text-sm font-medium text-gray-800">{data.origin_code} — {data.origin_city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Destination</p>
                <p className="text-sm font-medium text-gray-800">{data.destination_code} — {data.destination_city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Departure</p>
                <p className="text-sm font-medium text-gray-800">{data.departure_time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Arrival</p>
                <p className="text-sm font-medium text-gray-800">{data.arrival_time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Capacity</p>
                <p className="text-sm font-medium text-gray-800">{data.capacity_tons} tons</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Used</p>
                <p className="text-sm font-medium text-gray-800">{data.used_tons} tons</p>
              </div>
            </div>
            {/* Progress */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Progress</p>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500 transition-all" style={{ width: `${data.progress}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{data.progress}%</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { onClose(); setTimeout(() => { /* parent will handle mode switch */ }, 100); }} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition">Close</button>
            </div>
          </div>
        )}

        {/* Create / Edit Mode */}
        {(mode === "create" || mode === "edit") && (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" placeholder="PT-123" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft</label>
                <input type="text" required value={form.aircraft} onChange={(e) => setForm({ ...form, aircraft: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" placeholder="Boeing 777-F" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin Code</label>
                <input type="text" required value={form.origin_code} onChange={(e) => setForm({ ...form, origin_code: e.target.value.toUpperCase() })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" placeholder="CGK" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin City</label>
                <input type="text" required value={form.origin_city} onChange={(e) => setForm({ ...form, origin_city: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" placeholder="Jakarta" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Code</label>
                <input type="text" required value={form.destination_code} onChange={(e) => setForm({ ...form, destination_code: e.target.value.toUpperCase() })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" placeholder="SIN" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination City</label>
                <input type="text" required value={form.destination_city} onChange={(e) => setForm({ ...form, destination_city: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" placeholder="Singapore" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                <input type="time" required value={form.departure_time} onChange={(e) => setForm({ ...form, departure_time: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                <input type="time" required value={form.arrival_time} onChange={(e) => setForm({ ...form, arrival_time: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition">
                  <option value="ACTIVE">Active</option>
                  <option value="DELAY">Delayed</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (tons)</label>
                <input type="number" min="0" required value={form.capacity_tons} onChange={(e) => setForm({ ...form, capacity_tons: Number(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition">Cancel</button>
              {mode === "edit" && (
                <button type="button" disabled={deleting} onClick={handleDelete} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50">
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              )}
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50">
                {saving ? "Saving..." : mode === "edit" ? "Update Flight" : "Create Flight"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
