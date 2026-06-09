"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormAlert from "@/components/ui/FormAlert";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import { useFormErrors } from "@/hooks/useFormErrors";
import { FORM_ERRORS } from "@/lib/form-errors";
import { validateShipmentForm, type ShipmentField } from "@/lib/validators/shipment-form";
import { saveShipment } from "@/lib/actions";

const SERVICE_RATES: Record<string, number> = {
  "Express Priority": 50000,
  "Standard Cargo": 30000,
  "Economy Cargo": 20000,
};

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

type AvailableCity = {
  code: string;
  city: string;
};

type ShipmentFormProps = {
  data?: Shipment | null;
  availableCities?: AvailableCity[];
};

function formatDate(value?: string | Date) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function uniqueCities(cities: AvailableCity[]) {
  const seen = new Set<string>();
  return cities.filter((entry) => {
    const key = entry.city.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function ShipmentForm({ data, availableCities = [] }: ShipmentFormProps) {
  const cityOptions = uniqueCities(availableCities);
  const router = useRouter();
  const [form, setForm] = useState({
    awb: data?.awb || "",
    sender_name: data?.sender_name || "",
    recipient_name: data?.recipient_name || "",
    origin: data?.origin || "",
    destination: data?.destination || "",
    phone_number: data?.phone_number || "",
    item_type: data?.item_type || "",
    weight: data?.weight?.toString() || "",
    price: String((SERVICE_RATES[data?.service_level || "Express Priority"] || 50000) * (Number(data?.weight) || 0)),
    shipping_date: formatDate(data?.shipping_date),
    service_level: data?.service_level || "Express Priority",
    status: data?.status || "In Transit",
    description: data?.description || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const {
    fieldErrors,
    formError,
    setFormError,
    setFieldErrorMap,
    clearFieldError,
    clearAllErrors,
  } = useFormErrors<ShipmentField>();

  useEffect(() => {
    if (!data) {
      fetch("/api/generate-awb")
        .then((res) => res.json())
        .then((json) => {
          if (json.awb) setForm((prev) => ({ ...prev, awb: json.awb }));
        });
    }
  }, [data]);

  useEffect(() => {
    const rate = SERVICE_RATES[form.service_level] || 50000;
    const calculatedPrice = rate * (parseFloat(form.weight) || 0);
    setForm((prev) => ({ ...prev, price: String(calculatedPrice) }));
  }, [form.weight, form.service_level]);

  const updateField = (name: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    if (name in fieldErrors) {
      clearFieldError(name as ShipmentField);
    }
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    const errors = validateShipmentForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrorMap(errors);
      return;
    }

    setIsSaving(true);

    const result = await saveShipment(form, !!data?.id, data?.id);

    if (result.success) {
      router.push("/shipments");
      router.refresh();
    } else {
      setFormError(result.error || FORM_ERRORS.saveFailed);
    }

    setIsSaving(false);
  };

  const handleClear = async () => {
    let newAwb = "";
    if (!data) {
      try {
        const res = await fetch("/api/generate-awb");
        const json = await res.json();
        if (json.awb) newAwb = json.awb;
      } catch {
        // keep empty
      }
    }

    setForm({
      awb: data ? form.awb : newAwb,
      sender_name: "",
      recipient_name: "",
      origin: "",
      destination: "",
      phone_number: "",
      item_type: "",
      weight: "",
      price: "0",
      shipping_date: "",
      service_level: "Express Priority",
      status: "In Transit",
      description: "",
    });
    clearAllErrors();
  };

  const inputClass = (field: ShipmentField) => fieldControlClass(Boolean(fieldErrors[field]), "form");

  // Hitung display weight untuk hint: minimal tampil 1 jika kosong
  const displayWeight = parseFloat(form.weight) > 0 ? form.weight : "1";
  const displayRate = (SERVICE_RATES[form.service_level] || 50000).toLocaleString("en-US");

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 min-h-[400px]">
      <form onSubmit={handleSubmit} noValidate>
        {formError && <FormAlert message={formError} />}

        <FormField
          label="AWB Number"
          htmlFor="awb"
          hint={data ? "AWB cannot be changed" : !form.awb ? "Generating AWB..." : undefined}
        >
          <input
            id="awb"
            readOnly
            className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 cursor-not-allowed ${
              form.awb ? "text-gray-800 font-medium" : "text-gray-400 italic"
            }`}
            value={form.awb || "Generating AWB..."}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-5">
          <FormField label="Shipping Date" htmlFor="shipping-date" required error={fieldErrors.shipping_date}>
            <input
              id="shipping-date"
              type="date"
              aria-invalid={Boolean(fieldErrors.shipping_date)}
              className={inputClass("shipping_date")}
              value={form.shipping_date}
              onChange={(e) => updateField("shipping_date", e.target.value)}
            />
          </FormField>

          <FormField label="Phone Number" htmlFor="phone-number" required error={fieldErrors.phone_number}>
            <input
              id="phone-number"
              placeholder="08xxxxxxxxxx"
              aria-invalid={Boolean(fieldErrors.phone_number)}
              className={inputClass("phone_number")}
              value={form.phone_number}
              onChange={(e) => updateField("phone_number", e.target.value)}
            />
          </FormField>

          <FormField label="Sender Name" htmlFor="sender-name" required error={fieldErrors.sender_name}>
            <input
              id="sender-name"
              placeholder="Sender name"
              aria-invalid={Boolean(fieldErrors.sender_name)}
              className={inputClass("sender_name")}
              value={form.sender_name}
              onChange={(e) => updateField("sender_name", e.target.value)}
            />
          </FormField>

          <FormField label="Recipient Name" htmlFor="recipient-name" required error={fieldErrors.recipient_name}>
            <input
              id="recipient-name"
              placeholder="Recipient name"
              aria-invalid={Boolean(fieldErrors.recipient_name)}
              className={inputClass("recipient_name")}
              value={form.recipient_name}
              onChange={(e) => updateField("recipient_name", e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Origin City" htmlFor="origin" required error={fieldErrors.origin}>
              <select
                id="origin"
                aria-invalid={Boolean(fieldErrors.origin)}
                className={inputClass("origin")}
                value={form.origin}
                onChange={(e) => updateField("origin", e.target.value)}
              >
                <option value="">Select origin city</option>
                {form.origin &&
                  !cityOptions.some((city) => city.city === form.origin) && (
                    <option value={form.origin}>{form.origin}</option>
                  )}
                {cityOptions.map((city) => (
                  <option key={`origin-${city.code}`} value={city.city}>
                    {city.city}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Destination City" htmlFor="destination" required error={fieldErrors.destination}>
              <select
                id="destination"
                aria-invalid={Boolean(fieldErrors.destination)}
                className={inputClass("destination")}
                value={form.destination}
                onChange={(e) => updateField("destination", e.target.value)}
              >
                <option value="">Select destination city</option>
                {form.destination &&
                  !cityOptions.some((city) => city.city === form.destination) && (
                    <option value={form.destination}>{form.destination}</option>
                  )}
                {cityOptions.map((city) => (
                  <option key={`destination-${city.code}`} value={city.city}>
                    {city.city}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Weight (kg)" htmlFor="weight" required error={fieldErrors.weight}>
            <input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              placeholder="10.5"
              aria-invalid={Boolean(fieldErrors.weight)}
              className={inputClass("weight")}
              value={form.weight}
              onChange={(e) => updateField("weight", e.target.value)}
            />
          </FormField>

          <FormField label="Item Type" htmlFor="item-type" required error={fieldErrors.item_type}>
            <input
              id="item-type"
              placeholder="Documents, electronics, clothing"
              aria-invalid={Boolean(fieldErrors.item_type)}
              className={inputClass("item_type")}
              value={form.item_type}
              onChange={(e) => updateField("item_type", e.target.value)}
            />
          </FormField>

          <FormField label="Service Level" htmlFor="service-level" required error={fieldErrors.service_level}>
            <select
              id="service-level"
              aria-invalid={Boolean(fieldErrors.service_level)}
              className={inputClass("service_level")}
              value={form.service_level}
              onChange={(e) => updateField("service_level", e.target.value)}
            >
              <option value="Express Priority">Express Priority</option>
              <option value="Standard Cargo">Standard Cargo</option>
              <option value="Economy Cargo">Economy Cargo</option>
            </select>
          </FormField>

          <FormField label="Status" htmlFor="status" required error={fieldErrors.status}>
            <select
              id="status"
              aria-invalid={Boolean(fieldErrors.status)}
              className={inputClass("status")}
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="In Transit">In Transit</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FormField>

          <FormField
            label="Shipping Price"
            htmlFor="price"
            hint={`Auto: ${displayWeight} kg × IDR ${displayRate}`}
          >
            <input
              id="price"
              readOnly
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 bg-gray-50 cursor-not-allowed"
              value={form.price}
            />
          </FormField>
        </div>

        <div className="mt-5">
          <FormField label="Shipment Notes" htmlFor="description" required error={fieldErrors.description}>
            <textarea
              id="description"
              rows={3}
              placeholder="Shipment notes"
              aria-invalid={Boolean(fieldErrors.description)}
              className={`w-full rounded-lg border px-3 py-2.5 outline-none text-sm text-gray-800 ${
                fieldErrors.description
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex justify-between items-center mt-10">
          <Link
            href="/shipments"
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </Link>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#0a327d] hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium min-w-[150px] disabled:opacity-70 transition-colors"
            >
              {isSaving ? "Saving..." : data ? "Update AWB" : "Save AWB"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}