export default function ShipmentStats() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400">TOTAL SHIPMENTS</p>
        <h2 className="text-xl font-bold">1,284</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400">IN TRANSIT</p>
        <h2 className="text-xl font-bold">432</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400">FLAGGED</p>
        <h2 className="text-xl font-bold text-red-500">18</h2>
      </div>

    </div>
  );
}