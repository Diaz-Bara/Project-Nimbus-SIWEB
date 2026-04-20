export default function FlightList() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Active Flights</h3>

      <div className="space-y-3 text-sm">
        <div className="p-3 bg-gray-100 rounded-lg">
          EP-702 | 14:20 → 16:05
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">
          EP-551 | Delayed
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">
          EP-009 | On Time
        </div>
      </div>
    </div>
  );
}