"use client";

import dynamic from "next/dynamic";

const FlightMapClient = dynamic(() => import("./FlightMapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-lg bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="h-4 w-1/3 bg-gray-200 rounded" />
    </div>
  ),
});

type FlightMapFlight = {
  id: number;
  code: string;
  status: string;
  origin_code: string;
  destination_code: string;
};

export default function FlightMapDynamic({
  flights,
}: {
  flights: FlightMapFlight[];
}) {
  return <FlightMapClient flights={flights} />;
}