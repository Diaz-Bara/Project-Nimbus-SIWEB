"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import { FORM_ERRORS } from "@/lib/form-errors";

type TrackingAdminSearchFormProps = {
  initialAwb?: string;
  recentAwb?: string;
};

export default function TrackingAdminSearchForm({
  initialAwb = "",
  recentAwb,
}: TrackingAdminSearchFormProps) {
  const router = useRouter();
  const [awb, setAwb] = useState(initialAwb);
  const [awbError, setAwbError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedAwb = awb.trim();
    if (!trimmedAwb) {
      setAwbError(FORM_ERRORS.required);
      return;
    }

    setAwbError(null);
    router.push(`/TrackingAdmin?awb=${encodeURIComponent(trimmedAwb)}`);
  };

  return (
    <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Enter Tracking Number"
          htmlFor="tracking-admin-awb"
          required
          error={awbError}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="tracking-admin-awb"
              type="text"
              placeholder="Enter AWB number"
              aria-invalid={Boolean(awbError)}
              className={`flex-1 ${fieldControlClass(Boolean(awbError), "form")}`}
              value={awb}
              onChange={(e) => {
                setAwb(e.target.value);
                if (awbError) setAwbError(null);
              }}
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap"
            >
              Track Shipment
            </button>
          </div>
        </FormField>
      </form>

      {recentAwb && (
        <p className="text-xs text-gray-400 mt-2">
          Recent:{" "}
          <a
            className="text-blue-600 hover:underline"
            href={`/TrackingAdmin?awb=${encodeURIComponent(recentAwb)}`}
          >
            {recentAwb}
          </a>
        </p>
      )}
    </div>
  );
}