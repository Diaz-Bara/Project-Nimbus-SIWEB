"use client";

import { useEffect, useState } from "react";
import FormAlert from "@/components/ui/FormAlert";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import { useFormErrors } from "@/hooks/useFormErrors";
import { FORM_ERRORS } from "@/lib/form-errors";
import { validateFlightForm, type FlightField } from "@/lib/validators/flight-form";

export type FlightFormData = {
  id?: number;
  code: string;
  aircraft: string;
  origin_code: string;
  origin_city: string;
  destination_code: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  capacity_tons: number;
  used_tons: number;
};

type FlightFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FlightFormData) => Promise<void>;
  flightData?: FlightFormData | null;
  isSaving?: boolean;
  errorMessage?: string | null;
};

const defaultForm: FlightFormData = {
  code: "",
  aircraft: "Boeing 777-F",
  origin_code: "CGK",
  origin_city: "Jakarta",
  destination_code: "SIN",
  destination_city: "Singapore",
  departure_time: "08:00",
  arrival_time: "10:00",
  status: "SCHEDULED",
  capacity_tons: 60,
  used_tons: 0,
};

export default function FlightFormModal({
  isOpen,
  onClose,
  onSave,
  flightData,
  isSaving = false,
  errorMessage,
}: FlightFormModalProps) {
  const [form, setForm] = useState<FlightFormData>(defaultForm);
  const {
    fieldErrors,
    formError,
    setFormError,
    setFieldErrorMap,
    clearFieldError,
    clearAllErrors,
  } = useFormErrors<FlightField>();
  const isEdit = Boolean(flightData?.id);

  useEffect(() => {
    if (flightData) {
      setForm(flightData);
    } else {
      setForm(defaultForm);
    }
    clearAllErrors();
  }, [flightData, isOpen, clearAllErrors]);

  if (!isOpen) return null;

  const updateField = <K extends keyof FlightFormData>(key: K, value: FlightFormData[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    clearFieldError(key as FlightField);
    setFormError(null);
  };

  const submitForm = async () => {
    clearAllErrors();

    const errors = validateFlightForm(form, isEdit);
    if (Object.keys(errors).length > 0) {
      setFieldErrorMap(errors);
      return;
    }

    try {
      await onSave(form);
    } catch {
      setFormError(FORM_ERRORS.saveFailed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const inputClass = (field: FlightField, extra = "") =>
    `${fieldControlClass(Boolean(fieldErrors[field]), "form")} ${extra}`.trim();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Update Flight" : "New Flight"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            aria-label="Close flight modal"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
        <div className="p-6">
          {(formError || errorMessage) && <FormAlert message={formError || errorMessage || FORM_ERRORS.saveFailed} />}

          <div className="space-y-4">
            <FormField
              label="Flight Code"
              htmlFor="flight-code"
              required={!isEdit}
              error={fieldErrors.code}
            >
              <input
                id="flight-code"
                readOnly={isEdit}
                placeholder="e.g. PT-882"
                aria-invalid={Boolean(fieldErrors.code)}
                aria-describedby={fieldErrors.code ? "flight-code-error" : undefined}
                className={inputClass(
                  "code",
                  isEdit ? "bg-gray-50 cursor-not-allowed opacity-70 uppercase" : "uppercase",
                )}
                value={form.code}
                onChange={(e) => updateField("code", e.target.value.toUpperCase())}
              />
            </FormField>

            <FormField label="Aircraft" htmlFor="aircraft" required error={fieldErrors.aircraft}>
              <input
                id="aircraft"
                placeholder="Boeing 777-F"
                aria-invalid={Boolean(fieldErrors.aircraft)}
                className={inputClass("aircraft")}
                value={form.aircraft}
                onChange={(e) => updateField("aircraft", e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Origin (e.g. CGK - Jakarta)"
                htmlFor="origin"
                required
                error={fieldErrors.origin_code || fieldErrors.origin_city}
              >
                <input
                  id="origin"
                  placeholder="CGK - Jakarta"
                  aria-invalid={Boolean(fieldErrors.origin_code || fieldErrors.origin_city)}
                  className={inputClass("origin_code", "uppercase")}
                  value={form.origin_code && form.origin_city ? `${form.origin_code} - ${form.origin_city}` : (form.origin_code || form.origin_city)}
                  onChange={(e) => {
                    const val = e.target.value;
                    const match = val.match(/^([a-zA-Z]{2,4})\s*-\s*(.+)$/);
                    if (match) {
                      updateField("origin_code", match[1].toUpperCase());
                      updateField("origin_city", match[2].trim());
                    } else {
                      updateField("origin_code", val.toUpperCase());
                      updateField("origin_city", "");
                    }
                  }}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Destination (e.g. DPS - Bali)"
                htmlFor="destination"
                required
                error={fieldErrors.destination_code || fieldErrors.destination_city}
              >
                <input
                  id="destination"
                  placeholder="DPS - Bali"
                  aria-invalid={Boolean(fieldErrors.destination_code || fieldErrors.destination_city)}
                  className={inputClass("destination_code", "uppercase")}
                  value={form.destination_code && form.destination_city ? `${form.destination_code} - ${form.destination_city}` : (form.destination_code || form.destination_city)}
                  onChange={(e) => {
                    const val = e.target.value;
                    const match = val.match(/^([a-zA-Z]{2,4})\s*-\s*(.+)$/);
                    if (match) {
                      updateField("destination_code", match[1].toUpperCase());
                      updateField("destination_city", match[2].trim());
                    } else {
                      updateField("destination_code", val.toUpperCase());
                      updateField("destination_city", "");
                    }
                  }}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Departure Time"
                htmlFor="departure-time"
                required
                error={fieldErrors.departure_time}
              >
                <input
                  id="departure-time"
                  type="time"
                  aria-invalid={Boolean(fieldErrors.departure_time)}
                  className={inputClass("departure_time")}
                  value={form.departure_time}
                  onChange={(e) => updateField("departure_time", e.target.value)}
                />
              </FormField>

              <FormField
                label="Arrival Time"
                htmlFor="arrival-time"
                required
                error={fieldErrors.arrival_time}
              >
                <input
                  id="arrival-time"
                  type="time"
                  aria-invalid={Boolean(fieldErrors.arrival_time)}
                  className={inputClass("arrival_time")}
                  value={form.arrival_time}
                  onChange={(e) => updateField("arrival_time", e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Status" htmlFor="status" required error={fieldErrors.status}>
                <select
                  id="status"
                  aria-invalid={Boolean(fieldErrors.status)}
                  className={`${inputClass("status")} bg-white`}
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DELAY">DELAY</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                </select>
              </FormField>

              <FormField
                label="Capacity (tons)"
                htmlFor="capacity-tons"
                required
                error={fieldErrors.capacity_tons}
              >
                <input
                  id="capacity-tons"
                  type="number"
                  min={0}
                  aria-invalid={Boolean(fieldErrors.capacity_tons)}
                  className={inputClass("capacity_tons")}
                  value={form.capacity_tons}
                  onChange={(e) => updateField("capacity_tons", Number(e.target.value))}
                />
              </FormField>

              <FormField
                label="Used (tons)"
                htmlFor="used-tons"
                required
                error={fieldErrors.used_tons}
              >
                <input
                  id="used-tons"
                  type="number"
                  min={0}
                  aria-invalid={Boolean(fieldErrors.used_tons)}
                  className={inputClass("used_tons")}
                  value={form.used_tons}
                  onChange={(e) => updateField("used_tons", Number(e.target.value))}
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void submitForm()}
            disabled={isSaving}
            className="px-6 py-2 bg-[#0a327d] hover:bg-blue-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}