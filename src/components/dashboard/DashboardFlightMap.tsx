import { sql } from "@/lib/actions";

export default async function DashboardFlightMap() {
  let flights: { code: string; origin_city: string; destination_city: string; status: string }[] = [];
  try {
    const data = await sql`SELECT code, origin_city, destination_city, status FROM flights WHERE status = 'ACTIVE' ORDER BY id LIMIT 10`;
    flights = data as any;
  } catch { flights = []; }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Flight Network Map</h3>
          <p className="text-xs text-gray-400">Active flight routes across network</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{flights.length} active</span>
      </div>
      <div className="relative bg-gradient-to-br from-blue-50 to-sky-100 rounded-lg h-60 overflow-hidden">
        <svg viewBox="0 0 800 400" className="w-full h-full opacity-60">
          {flights.length === 0 ? (
            <text x="400" y="200" textAnchor="middle" className="fill-gray-400 text-sm">No active flights</text>
          ) : (
            flights.map((f, i) => {
              const startX = 80 + (i * 65) % 600;
              const startY = 80 + (i * 37) % 250;
              const endX = startX + 80 + (i * 23) % 120;
              const endY = startY + 20 + (i * 17) % 80;
              return (
                <g key={f.code}>
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
                  <circle cx={startX} cy={startY} r="4" fill="#3b82f6" />
                  <circle cx={endX} cy={endY} r="4" fill="#10b981" />
                  <text x={startX} y={startY - 8} textAnchor="middle" className="fill-gray-600 text-[9px] font-medium">{f.origin_city?.slice(0,3)}</text>
                  <text x={endX} y={endY - 8} textAnchor="middle" className="fill-gray-600 text-[9px] font-medium">{f.destination_city?.slice(0,3)}</text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
