export default function TrackingSidebar() {
  return (
    <div className="space-y-4">

      {/* DETAIL */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400 mb-2">
          SHIPMENT DETAILS
        </p>

        <p className="text-sm">
          Service: <span className="font-semibold text-blue-600">⚡ Petir Lightning Express</span>
        </p>

        <p className="text-sm mt-2">
          Weight: 142.5 KG
        </p>

        <p className="text-sm">
          Pieces: 3 Units
        </p>
      </div>

      {/* MAP */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400 mb-2">
          CURRENT LOCATION MAP
        </p>

        <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          Map Preview
        </div>
      </div>
    </div>
  );
}