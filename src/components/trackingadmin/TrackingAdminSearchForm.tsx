"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import { validateTrackingAwb } from "@/lib/validators/tracking-form";

type TrackingAdminSearchFormProps = {
  defaultAwb?: string;
};

export default function TrackingAdminSearchForm({
  defaultAwb = "",
}: TrackingAdminSearchFormProps) {
  const router = useRouter();
  const [awb, setAwb] = useState(defaultAwb);
  const [awbError, setAwbError] = useState<string | null>(null);

  useEffect(() => {
    setAwb(defaultAwb);
  }, [defaultAwb]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateTrackingAwb(awb);
    if (error) {
      setAwbError(error);
      return;
    }

    setAwbError(null);
    router.push(`/TrackingAdmin?awb=${encodeURIComponent(awb.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        label="AWB Number"
        htmlFor="tracking-admin-awb"
        required
        error={awbError}
      >
        <div className="flex gap-2">
          <input
            id="tracking-admin-awb"
            name="awb"
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
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition shrink-0"
          >
            Track Shipment
          </button>
        </div>
      </FormField>
    </form>
  );
}