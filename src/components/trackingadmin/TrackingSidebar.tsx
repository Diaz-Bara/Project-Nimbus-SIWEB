import { getTrackingByAwb } from "@/lib/actions";

export default async function TrackingSidebar({ awb }: { awb: string }) {
  const result = (await getTrackingByAwb(awb)) as any;
  const shipment = result?.success ? result.shipment : null;

  const statusColor = (s: string) => {
    const st = (s || "").toLowerCase();
    if (st.includes("deliver")) return "text-green-600 bg-green-50 border-green-100";
    if (st.includes("transit")) return "text-blue-600 bg-blue-50 border-blue-100";
    if (st.includes("cancel")) return "text-red-600 bg-red-50 border-red-100";
    if (st.includes("pending")) return "text-yellow-600 bg-yellow-50 border-yellow-100";
    return "text-gray-600 bg-gray-50 border-gray-100";
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shipment Details</p>

        {!shipment ? (
          <p className="text-sm text-gray-500">Enter an AWB to view shipment details.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">AWB</span>
              <span className="text-sm font-bold text-blue-700">{shipment.awb}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Status</span>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor(shipment.status)}`}>{shipment.status}</span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Origin</span>
                <span className="text-sm font-medium text-gray-800">{shipment.origin}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Destination</span>
                <span className="text-sm font-medium text-gray-800">{shipment.destination}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Service Level</span>
                <span className="text-sm font-medium text-gray-800">{shipment.service_level}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Weight</span>
                <span className="text-sm font-medium text-gray-800">{shipment.weight} KG</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Shipping Price</span>
                <span className="text-sm font-bold text-blue-800">Rp {(shipment.price || 0).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Recipient</span>
                <span className="text-sm font-medium text-gray-800">{shipment.recipient_name || "-"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Current Location</p>

        <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100 rounded-lg h-40 overflow-hidden border border-gray-100 flex items-center justify-center">
          {shipment ? (
            <svg viewBox="0 0 600 160" className="w-full h-full">
              <line x1="80" y1="80" x2="520" y2="80" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6,4" />
              <line x1="80" y1="80" x2={80 + (440 * ((shipment.status || "").toLowerCase().includes("deliver") ? 100 : (shipment.status || "").toLowerCase().includes("transit") ? 50 : 25) / 100)} y2="80" stroke={(shipment.status || "").toLowerCase().includes("deliver") ? "#10b981" : "#3b82f6"} strokeWidth="4" />
              <circle cx="80" cy="80" r="6" fill="white" stroke="#3b82f6" strokeWidth="3" />
              <circle cx="520" cy="80" r="6" fill="white" stroke={(shipment.status || "").toLowerCase().includes("deliver") ? "#10b981" : "#cbd5e1"} strokeWidth="3" />
              <circle cx={80 + (440 * ((shipment.status || "").toLowerCase().includes("deliver") ? 100 : (shipment.status || "").toLowerCase().includes("transit") ? 50 : 25) / 100)} cy="80" r="8" fill={(shipment.status || "").toLowerCase().includes("deliver") ? "#10b981" : "#f59e0b"} stroke="white" strokeWidth="2" />
              <text x="80" y="110" textAnchor="middle" className="fill-gray-700 text-[11px] font-bold">{shipment.origin}</text>
              <text x="520" y="110" textAnchor="middle" className="fill-gray-700 text-[11px] font-bold">{shipment.destination}</text>
            </svg>
          ) : (
            <p className="text-gray-400 text-xs">No shipment data</p>
          )}
        </div>
      </div>
    </div>
  );
}
