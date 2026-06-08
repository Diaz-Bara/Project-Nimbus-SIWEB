export default function TrackingMap({ origin, destination, status }: { origin: string; destination: string; status: string }) {
  const isDelivered = status.toLowerCase() === "delivered";
  const progress = isDelivered ? 100 : status.toLowerCase().includes("transit") ? 50 : 25;
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Current Location Map</h3>
          <p className="text-xs text-gray-400">Live shipment visibility</p>
        </div>
      </div>
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100 rounded-lg h-48 overflow-hidden border border-gray-100 flex items-center justify-center">
        <svg viewBox="0 0 600 200" className="w-full h-full">
          <line x1="100" y1="100" x2="500" y2="100" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6,4" />
          <line x1="100" y1="100" x2={100 + (400 * (progress / 100))} y2="100" stroke={isDelivered ? "#10b981" : "#3b82f6"} strokeWidth="4" />
          
          <circle cx="100" cy="100" r="8" fill="white" stroke="#3b82f6" strokeWidth="4" />
          <circle cx="500" cy="100" r="8" fill="white" stroke={isDelivered ? "#10b981" : "#cbd5e1"} strokeWidth="4" />
          
          <circle cx={100 + (400 * (progress / 100))} cy="100" r="10" fill={isDelivered ? "#10b981" : "#f59e0b"} stroke="white" strokeWidth="3" />
          
          <text x="100" y="130" textAnchor="middle" className="fill-gray-700 text-sm font-bold">{origin}</text>
          <text x="100" y="150" textAnchor="middle" className="fill-gray-400 text-xs">Origin</text>
          
          <text x="500" y="130" textAnchor="middle" className="fill-gray-700 text-sm font-bold">{destination}</text>
          <text x="500" y="150" textAnchor="middle" className="fill-gray-400 text-xs">Destination</text>
          
          {!isDelivered && (
            <g transform={`translate(${100 + (400 * (progress / 100))}, 70)`}>
              <rect x="-40" y="-20" width="80" height="24" rx="4" fill="#3b82f6" />
              <text x="0" y="-3" textAnchor="middle" className="fill-white text-[10px] font-bold">In Transit</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
