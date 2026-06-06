import { fetchShipmentStats } from "@/lib/actions";

export default async function ShipmentStats() {
  const stats = await fetchShipmentStats();

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400">TOTAL SHIPMENTS</p>
        <h2 className="text-xl font-bold">{stats.total}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400">IN TRANSIT</p>
        <h2 className="text-xl font-bold">{stats.inTransit}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400">CANCELED</p>
        <h2 className="text-xl font-bold text-red-500">{stats.canceled}</h2>
      </div>

    </div>
  );
}
