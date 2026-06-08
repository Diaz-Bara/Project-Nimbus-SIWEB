"use client";

import dynamic from "next/dynamic";

const DashboardFlightMapClient = dynamic(
  () => import("./DashboardFlightMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 rounded-lg bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
    ),
  },
);

type DashboardFlight = {
  id: number;
  code: string;
  status: string;
  origin_code: string;
  destination_code: string;
};

export default function DashboardFlightMapDynamic({
  flights,
}: {
  flights: DashboardFlight[];
}) {
  return <DashboardFlightMapClient flights={flights} />;
}