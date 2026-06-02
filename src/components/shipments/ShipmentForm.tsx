"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveShipment } from "@/lib/actions";

type Shipment = {
  id: number;
  awb: string;
  sender_name?: string;
  recipient_name?: string;
  origin: string;
  destination: string;
  phone_number?: string;
  item_type?: string;
  vehicle_type?: string;
  weight: number;
  pieces: number;
  price?: number;
  shipping_date?: string | Date;
  service_level?: string;
  status: string;
  description?: string;
};

type ShipmentFormProps = {
  data?: Shipment | null;
};

function generateAwb() {
  const today = new Date();
  const date = today.toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AWB-${date}-${random}`;
}

function formatDate(value?: string | Date) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export default function ShipmentForm({ data }: ShipmentFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    awb: data?.awb || generateAwb(),
    sender_name: data?.sender_name || "",
    recipient_name: data?.recipient_name || "",
    origin: data?.origin || "",
    destination: data?.destination || "",
    phone_number: data?.phone_number || "",
    item_type: data?.item_type || "",
    vehicle_type: data?.vehicle_type || "Air Cargo",
    weight: data?.weight?.toString() || "",
    pieces: data?.pieces?.toString() || "1",
    price: data?.price?.toString() || "0",
    shipping_date: formatDate(data?.shipping_date),
    service_level: data?.service_level || "Express Priority",
    status: data?.status || "In Transit",
    description: data?.description || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFormLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await saveShipment(form, !!data?.id, data?.id);

    if (result.success) {
      router.push("/shipments");
      router.refresh();
    } else {
      setMessage(result.error || "Gagal menyimpan data shipment.");
    }

    setIsSaving(false);
  };

  const handleClear = () => {
    setForm({
      awb: generateAwb(),
      sender_name: "",
      recipient_name: "",
      origin: "",
      destination: "",
      phone_number: "",
      item_type: "",
      vehicle_type: "Air Cargo",
      weight: "",
      pieces: "1",
      price: "0",
      shipping_date: new Date().toISOString().slice(0, 10),
      service_level: "Express Priority",
      status: "In Transit",
      description: "",
    });
    setMessage(null);
  };

  const updateField = (name: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 min-h-[400px]">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        {data ? "Update Shipment" : "Create New Shipment"}
      </h2>

      {isFormLoading ? (
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-full bg-gray-100 rounded border-b border-gray-200" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
          {message && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AWB / No Resi</label>
                <input
                  required
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.awb}
                  onChange={(e) => updateField("awb", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                <input
                  required
                  placeholder="Nama pengirim"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.sender_name}
                  onChange={(e) => updateField("sender_name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                <input
                  required
                  placeholder="Nama penerima"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.recipient_name}
                  onChange={(e) => updateField("recipient_name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                <input
                  required
                  placeholder="Kota asal"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.origin}
                  onChange={(e) => updateField("origin", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  required
                  placeholder="Kota tujuan"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.destination}
                  onChange={(e) => updateField("destination", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  required
                  placeholder="081234567890"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.phone_number}
                  onChange={(e) => updateField("phone_number", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Date</label>
                <input
                  required
                  type="date"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.shipping_date}
                  onChange={(e) => updateField("shipping_date", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
                <input
                  required
                  placeholder="Dokumen, elektronik, pakaian"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.item_type}
                  onChange={(e) => updateField("item_type", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (KG)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                    value={form.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pieces</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                    value={form.pieces}
                    onChange={(e) => updateField("pieces", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Price</label>
                <input
                  required
                  type="number"
                  min="0"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <select
                    required
                    className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                    value={form.vehicle_type}
                    onChange={(e) => updateField("vehicle_type", e.target.value)}
                  >
                    <option value="Air Cargo">Air Cargo</option>
                    <option value="Truck">Truck</option>
                    <option value="Ship">Ship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Level</label>
                  <select
                    required
                    className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                    value={form.service_level}
                    onChange={(e) => updateField("service_level", e.target.value)}
                  >
                    <option value="Express Priority">Express Priority</option>
                    <option value="Standard Cargo">Standard Cargo</option>
                    <option value="Economy Cargo">Economy Cargo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  required
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="In Transit">In Transit</option>
                  <option value="Pending QC">Pending QC</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description / Notes</label>
            <textarea
              required
              rows={3}
              placeholder="Catatan pengiriman"
              className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:border-[#0a327d] text-sm text-gray-800"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="flex justify-start gap-4 mt-10">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#0a327d] hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium min-w-[150px] disabled:opacity-70"
            >
              {isSaving ? "Processing..." : data ? "Update Shipment" : "Save Shipment"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>

            <Link
              href="/shipments"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium ml-auto"
            >
              Back
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
