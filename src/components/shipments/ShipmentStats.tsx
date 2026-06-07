import { fetchShipmentStats } from "@/lib/actions";

export default async function ShipmentStats() {
  const stats = await fetchShipmentStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Shipment</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</h2>
        <p className="text-[11px] text-gray-400 mt-1">All registered cargo</p>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">In Transit</p>
        <h2 className="text-2xl font-bold text-blue-600 mt-1">{stats.inTransit}</h2>
        <p className="text-[11px] text-gray-400 mt-1">Currently shipping</p>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Delivered</p>
        <h2 className="text-2xl font-bold text-green-600 mt-1">{stats.delivered}</h2>
        <p className="text-[11px] text-gray-400 mt-1">Successfully arrived</p>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cancelled</p>
        <h2 className="text-2xl font-bold text-red-500 mt-1">{stats.canceled}</h2>
        <p className="text-[11px] text-gray-400 mt-1">Cancelled shipments</p>
      </div>
    </div>
  );
}
