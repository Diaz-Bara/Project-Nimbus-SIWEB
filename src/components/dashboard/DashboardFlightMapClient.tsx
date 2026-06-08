"use client";

import FlightNetworkMapView from "@/components/maps/FlightNetworkMapView";
import type { NetworkFlight } from "@/lib/airport-coords";

export default function DashboardFlightMapClient({
  flights,
}: {
  flights: NetworkFlight[];
}) {
  return <FlightNetworkMapView flights={flights} />;
}