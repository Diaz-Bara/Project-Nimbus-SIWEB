import { sql } from "@/lib/actions";

export default async function FlightMap() {
  let flights: { code: string; origin_code: string; origin_city: string; destination_code: string; destination_city: string; status: string; progress: number }[] = [];
  try {
    flights = (await sql`SELECT code, origin_code, origin_city, destination_code, destination_city, status, progress FROM flights ORDER BY id`) as any;
  } catch { flights = []; }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Global Flight Network</h3>
          <p className="text-xs text-gray-400">Active routes across the logistics network</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">{flights.length} flights</span>
      </div>
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100 rounded-lg h-80 overflow-hidden border border-gray-100">
        <svg viewBox="0 0 1000 400" className="w-full h-full">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {flights.length === 0 ? (
            <text x="500" y="200" textAnchor="middle" className="fill-gray-400 text-sm">No active flights in network</text>
          ) : (
            flights.map((f, i) => {
              const cols = Math.ceil(Math.sqrt(flights.length));
              const row = Math.floor(i / cols);
              const col = i % cols;
              const startX = 100 + col * (800 / cols);
              const startY = 60 + row * 100;
              const endX = startX + 60 + (f.progress * 0.8);
              const endY = startY + 20 + (i % 3) * 15;
              return (
                <g key={f.code}>
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6,3" />
                  <circle cx={startX} cy={startY} r="5" fill="#3b82f6" stroke="white" strokeWidth="2" />
                  <circle cx={endX} cy={endY} r="5" fill="#10b981" stroke="white" strokeWidth="2" />
                  <text x={startX} y={startY - 10} textAnchor="middle" className="fill-gray-700 text-[10px] font-bold">{f.origin_code}</text>
                  <text x={startX} y={startY + 18} textAnchor="middle" className="fill-gray-400 text-[8px]">{f.origin_city?.slice(0,12)}</text>
                  <text x={endX} y={endY - 10} textAnchor="middle" className="fill-gray-700 text-[10px] font-bold">{f.destination_code}</text>
                  <text x={endX} y={endY + 18} textAnchor="middle" className="fill-gray-400 text-[8px]">{f.destination_city?.slice(0,12)}</text>
                  <text x={(startX + endX) / 2} y={Math.min(startY, endY) - 5} textAnchor="middle" className="fill-blue-600 text-[9px] font-semibold">{f.code}</text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
