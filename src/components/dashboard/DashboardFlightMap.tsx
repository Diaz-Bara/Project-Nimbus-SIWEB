import { fetchDashboardFlights } from "@/lib/actions";
import DashboardFlightMapDynamic from "./DashboardFlightMapDynamic";

export default async function DashboardFlightMap() {
  const flights = await fetchDashboardFlights(10);
  const activeCount = flights.filter(
    (flight) => String(flight.status).toUpperCase() === "ACTIVE",
  ).length;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Flight Network Map</h3>
          <p className="text-xs text-gray-400">Active flight routes across network</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {activeCount} active
        </span>
      </div>
      <DashboardFlightMapDynamic flights={flights} />
    </div>
  );
}