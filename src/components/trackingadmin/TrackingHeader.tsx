// src/components/trackingadmin/TrackingHeader.tsx

export default async function TrackingHeader() {
  // Simulasi waktu memuat data selama 1.5 detik
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      {/* SEARCH */}
      <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400 mb-2">ENTER TRACKING NUMBER</p>
        <div className="flex gap-2">
          <input
            placeholder="AWB-8802-PETIR-XP"
            className="flex-1 border border-gray-200 px-4 py-2 rounded-lg text-sm"
          />
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
            Track Shipment
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Recent: <span className="text-blue-600 cursor-pointer hover:underline">AWB-7721-KT-SIN</span>
        </p>
      </div>

      {/* CARD */}
      <div className="bg-blue-900 text-white p-4 rounded-xl shadow-sm flex flex-col justify-center">
        <p className="font-semibold mb-1">Express Network</p>
        <p className="text-sm text-blue-200">
          Our AI logistics network maintains 98.8% precision delivery rates
        </p>
      </div>
    </div>
  );
}