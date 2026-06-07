import { sql } from "@/lib/actions";

export default async function CargoProgressChart() {
  let data: { status: string; count: number }[] = [];
  try {
    data = (await sql`SELECT status, COUNT(*)::int AS count FROM shipments GROUP BY status ORDER BY count DESC`) as any;
  } catch { data = []; }

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const colors: Record<string, string> = {
    "In Transit": "bg-blue-500",
    "Delivered": "bg-green-500",
    "Cancelled": "bg-red-400",
    "Pending QC": "bg-yellow-500",
    "Scheduled": "bg-purple-500",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-1">Cargo Progress</h3>
      <p className="text-xs text-gray-400 mb-5">Distribution by shipment status</p>
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No shipment data available</p>
        ) : (
          data.map((item) => (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">{item.status}</span>
                <span className="text-xs font-bold text-gray-800">{item.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${colors[item.status] || "bg-gray-400"}`} style={{ width: `${(item.count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
