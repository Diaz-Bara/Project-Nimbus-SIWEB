"use client";
import { useState } from "react";

type Shipment = {
  id: number;
  awb: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
};

type ShipmentForm = {
  awb: string;
  origin: string;
  destination: string;
  weight: string;
  pieces: string;
  status: string;
};

type Props = {
  data: Shipment | null;
  onClose: () => void;
  onSave: (shipment: Shipment) => void;
};

export default function ShipmentModal({ data, onClose, onSave }: Props) {

  // ✅ pakai type khusus form (bukan Shipment langsung)
  const [form, setForm] = useState<ShipmentForm>({
    awb: data?.awb || "",
    origin: data?.origin || "",
    destination: data?.destination || "",
    weight: data?.weight?.toString() || "",
    pieces: data?.pieces?.toString() || "",
    status: data?.status || "In Transit",
  });

  // ✅ handle submit clean
  const handleSubmit = () => {
    onSave({
      id: data?.id ?? Date.now(), // kalau create → auto id
      awb: form.awb,
      origin: form.origin,
      destination: form.destination,
      weight: Number(form.weight),
      pieces: Number(form.pieces),
      status: form.status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-96">

        <h2 className="font-semibold mb-4">
          {data ? "Edit Shipment" : "Create Shipment"}
        </h2>

        {/* INPUT */}
        <input
          placeholder="AWB"
          className="w-full border p-2 mb-2"
          value={form.awb}
          onChange={(e) => setForm({ ...form, awb: e.target.value })}
        />

        <input
          placeholder="Origin"
          className="w-full border p-2 mb-2"
          value={form.origin}
          onChange={(e) => setForm({ ...form, origin: e.target.value })}
        />

        <input
          placeholder="Destination"
          className="w-full border p-2 mb-2"
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
        />

        <input
          type="number"
          placeholder="Weight"
          className="w-full border p-2 mb-2"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />

        <input
          type="number"
          placeholder="Pieces"
          className="w-full border p-2 mb-2"
          value={form.pieces}
          onChange={(e) => setForm({ ...form, pieces: e.target.value })}
        />

        {/* STATUS */}
        <select
          className="w-full border p-2 mb-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>In Transit</option>
          <option>Pending QC</option>
          <option>Delayed</option>
        </select>

        {/* BUTTON */}
        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>

        </div>
      </div>
    </div>
  );
}