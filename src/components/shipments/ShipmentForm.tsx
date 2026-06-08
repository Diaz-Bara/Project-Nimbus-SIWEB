"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveShipment, getNextAwb } from "@/lib/actions";

type Shipment = {
  id: number;
  awb: string;
  sender_name?: string;
  recipient_name?: string;
  origin: string;
  destination: string;
  phone_number?: string;
  item_type?: string;
  weight: number;
  price?: number;
  shipping_date?: string | Date;
  service_level?: string;
  status: string;
  description?: string;
};

type ShipmentFormProps = {
  data?: Shipment | null;
};

const SERVICE_RATES: Record<string, number> = {
  "Express Priority": 50000,
  "Standard Cargo": 30000,
  "Economy Cargo": 20000,
};

function formatDate(value?: string | Date) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function calcPrice(weight: string, serviceLevel: string): string {
  const w = parseFloat(weight) || 0;
  const rate = SERVICE_RATES[serviceLevel] || 0;
  return (w * rate).toString();
}

export default function ShipmentForm({ data }: ShipmentFormProps) {
  const router = useRouter();
  const [awb, setAwb] = useState(data?.awb || "");
  const [loadingAwb, setLoadingAwb] = useState(!data);

  const [form, setForm] = useState({
    sender_name: data?.sender_name || "",
    recipient_name: data?.recipient_name || "",
    origin: data?.origin || "",
    destination: data?.destination || "",
    phone_number: data?.phone_number || "",
    item_type: data?.item_type || "",
    weight: data?.weight?.toString() || "",
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
    if (!data) {
      getNextAwb().then((next) => {
        setAwb(next);
        setLoadingAwb(false);
      });
    } else {
      setLoadingAwb(false);
    }
  }, [data]);

  useEffect(() => {
    if (!isFormLoading) {
      setIsFormLoading(false);
    }
  }, []);

  useEffect(() => {
    const newPrice = calcPrice(form.weight, form.service_level);
    setForm((prev) => ({ ...prev, price: newPrice }));
  }, [form.weight, form.service_level]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const payload = { ...form, awb };
    const result = await saveShipment(payload, !!data?.id, data?.id);

    if (result.success) {
      router.push("/shipments");
      router.refresh();
    } else {
      setMessage(result.error || "Failed to save shipment data.");
    }

    setIsSaving(false);
  };

  const updateField = (name: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 min-h-[400px]">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        {data ? "Update Shipment" : "Create New Shipment"}
      </h2>

      {isFormLoading || loadingAwb ? (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Shipment Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AWB Number</label>
                <input
                  readOnly
                  className="w-full pb-2 border-b border-gray-200 outline-none text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
                  value={awb}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                <input
                  required
                  type="text"
                  placeholder="Sender name"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.sender_name}
                  onChange={(e) => updateField("sender_name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                <input
                  required
                  type="text"
                  placeholder="Recipient name"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.recipient_name}
                  onChange={(e) => updateField("recipient_name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  required
                  type="text"
                  placeholder="Phone number"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.phone_number}
                  onChange={(e) => updateField("phone_number", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <input
                    required
                    type="text"
                    placeholder="Origin city"
                    className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                    value={form.origin}
                    onChange={(e) => updateField("origin", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    required
                    type="text"
                    placeholder="Destination city"
                    className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                    value={form.destination}
                    onChange={(e) => updateField("destination", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Cargo Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
                <input
                  required
                  type="text"
                  placeholder="Item type"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.item_type}
                  onChange={(e) => updateField("item_type", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (KG)</label>
                <input
                  required
                  type="number"
                  min="1"
                  placeholder="Weight in KG"
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Level</label>
                <select
                  required
                  className="w-full pb-2 border-b border-gray-200 outline-none focus:border-[#0a327d] text-sm text-gray-800 bg-transparent"
                  value={form.service_level}
                  onChange={(e) => updateField("service_level", e.target.value)}
                >
                  <option value="Express Priority">Express Priority — Rp 50.000/KG</option>
                  <option value="Standard Cargo">Standard Cargo — Rp 30.000/KG</option>
                  <option value="Economy Cargo">Economy Cargo — Rp 20.000/KG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Price</label>
                <input
                  readOnly
                  type="text"
                  className="w-full pb-2 border-b border-gray-200 outline-none text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
                  value={`Rp ${(parseFloat(form.price) || 0).toLocaleString("id-ID")}`}
                />
                <input type="hidden" value={form.price} name="price" />
              </div>

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
              placeholder="Shipment notes"
              className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:border-[#0a327d] text-sm text-gray-800"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Link
              href="/shipments"
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#0a327d] hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium min-w-[150px] disabled:opacity-70"
            >
              {isSaving ? "Processing..." : data ? "Update Shipment" : "Save Shipment"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
