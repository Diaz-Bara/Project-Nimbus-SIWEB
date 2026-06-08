import { fetchFlights } from "@/lib/actions";
import FlightMapDynamic from "./FlightMapDynamic";

export default async function FlightMap() {
  const flights = await fetchFlights("", 1);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-400 mb-3">LIVE ROUTE MAP</p>
      <FlightMapDynamic flights={flights} />
    </div>
  );
}