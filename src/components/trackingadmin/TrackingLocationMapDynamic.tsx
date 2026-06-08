"use client";

import dynamic from "next/dynamic";

const TrackingLocationMap = dynamic(() => import("./TrackingLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-32 rounded-lg bg-gray-100 animate-pulse flex items-center justify-center text-xs text-gray-400">
      Loading map...
    </div>
  ),
});

type TrackingLocationMapProps = {
  destination: string;
  status: string;
  lastLocation?: string;
};

export default function TrackingLocationMapDynamic(props: TrackingLocationMapProps) {
  return <TrackingLocationMap {...props} />;
}