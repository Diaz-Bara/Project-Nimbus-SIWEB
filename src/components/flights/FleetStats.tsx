export default function FleetStats() {
  return (
    <div className="bg-blue-900 text-white p-6 rounded-xl shadow-sm">

      <p className="text-xs text-blue-300 mb-2">
        DAILY FLEET EFFICIENCY
      </p>

      <h1 className="text-4xl font-bold mb-2">
        94.2%
      </h1>

      <p className="text-sm text-blue-300 mb-4">
        +2.1% from yesterday
      </p>

      <div className="h-2 bg-blue-700 rounded mb-2">
        <div className="h-2 bg-white rounded w-[80%]" />
      </div>

      <p className="text-xs text-blue-300">
        Capacity Used: 482 / 510 Tons
      </p>
    </div>
  );
}