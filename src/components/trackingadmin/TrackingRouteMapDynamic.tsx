"use client";

import dynamic from "next/dynamic";

const TrackingRouteMapClient = dynamic(
  () => import("./TrackingRouteMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 rounded-lg bg-gray-100 animate-pulse flex items-center justify-center text-xs text-gray-400">
        Loading map...
      </div>
    ),
  }
);

type Props = {
  origin: string;
  destination: string;
  status: string;
};

export default function TrackingRouteMapDynamic(props: Props) {
  return <TrackingRouteMapClient {...props} />;
}