"use client";

import dynamic from "next/dynamic";
import type { FlightNetworkCity } from "./FlightMapClient";
import type { NetworkFlight } from "@/lib/airport-coords";

const FlightMapClient = dynamic(() => import("./FlightMapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-80 rounded-lg bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="h-4 w-1/3 bg-gray-200 rounded" />
    </div>
  ),
});

type FlightMapDynamicProps = {
  flights: NetworkFlight[];
  cities: FlightNetworkCity[];
};

export default function FlightMapDynamic({ flights, cities }: FlightMapDynamicProps) {
  return <FlightMapClient flights={flights} cities={cities} />;
}