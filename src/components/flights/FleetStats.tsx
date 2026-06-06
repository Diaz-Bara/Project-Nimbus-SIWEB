import { fetchFlightStats } from "@/lib/actions";

export default async function FleetStats() {
  const stats = await fetchFlightStats();
  const efficiency = stats.efficiency;

  return (
    <div className="bg-blue-900 text-white p-6 rounded-xl shadow-sm">

      <p className="text-xs text-blue-300 mb-2">
        DAILY FLEET EFFICIENCY
      </p>

      <h1 className="text-4xl font-bold mb-2">
        {efficiency}%
      </h1>

      <p className="text-sm text-blue-300 mb-4">
        {stats.active} active from {stats.total} flights
      </p>

      <div className="h-2 bg-blue-700 rounded mb-2">
        <div
          className="h-2 bg-white rounded"
          style={{ width: `${Math.min(efficiency, 100)}%` }}
        />
      </div>

      <p className="text-xs text-blue-300">
        Capacity Used: {stats.used} / {stats.capacity} Tons
      </p>
    </div>
  );
}
