"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import { validateTrackingAwb } from "@/lib/validators/tracking-form";
import { getTrackingByAwb } from "@/lib/actions";
import AwbNotFoundCard from "@/components/errors/AwbNotFoundCard";
import TrackingResult, {
  type TrackingHistoryItem,
  type TrackingShipment,
} from "@/components/tracking/TrackingResult";

type TrackingResponse = {
  success: boolean;
  error?: string;
  shipment?: TrackingShipment;
  history?: TrackingHistoryItem[];
};

export default function TrackingForm() {
  const searchParams = useSearchParams();
  const [awb, setAwb] = useState("");
  const [result, setResult] = useState<TrackingResponse | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [awbError, setAwbError] = useState<string | null>(null);
  const [notFoundAwb, setNotFoundAwb] = useState<string | null>(null);

  const runTrack = useCallback(
    async (value: string) => {
      const validationError = validateTrackingAwb(value);
      if (validationError) {
        setAwbError(validationError);
        setResult(null);
        setNotFoundAwb(null);
        return;
      }

      const trimmedAwb = value.trim();
      setAwbError(null);
      setNotFoundAwb(null);
      setIsSearching(true);
      const tracking = (await getTrackingByAwb(trimmedAwb)) as TrackingResponse;

      if (!tracking.success) {
        setResult(null);
        setNotFoundAwb(trimmedAwb);
        setIsSearching(false);
        return;
      }

      setResult(tracking);
      setIsSearching(false);
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const queryAwb = searchParams.get("awb");
    if (queryAwb) {
      setAwb(queryAwb);
      void runTrack(queryAwb);
    }
  }, [searchParams, runTrack]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateTrackingAwb(awb);
    if (validationError) {
      setAwbError(validationError);
      setResult(null);
      setNotFoundAwb(null);
      return;
    }
    await runTrack(awb);
  };

  return (
    <div className="flex flex-col w-full">
      {isPageLoading ? (
        <div className="flex flex-col justify-center space-y-4 animate-pulse w-full">
          <div className="h-3 w-40 bg-gray-200 rounded" />
          <div className="flex gap-2 w-full">
            <div className="h-11 flex-1 bg-gray-200 rounded-lg border border-blue-100" />
            <div className="h-11 w-28 bg-blue-200 rounded-lg" />
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleTrack} noValidate className="w-full">
            <FormField label="AWB Number" htmlFor="awb-input" required error={awbError}>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="awb-input"
                  type="text"
                  placeholder="e.g. AWB-010"
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
                  disabled={isSearching}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-medium min-w-[110px] disabled:opacity-70 disabled:cursor-not-allowed transition shadow-sm"
                >
                  {isSearching ? "Searching..." : "Track"}
                </button>
              </div>
            </FormField>
          </form>

          {notFoundAwb && (
            <div className="w-full mt-6">
              <AwbNotFoundCard
                awb={notFoundAwb}
                backHref="/tracking"
                backLabel="Back"
              />
            </div>
          )}

          {result?.success && result.shipment && (
            <div className="w-full mt-6 pt-6 border-t border-gray-100">
              <TrackingResult shipment={result.shipment} history={result.history || []} />
            </div>
          )}
        </>
      )}
    </div>
  );
}