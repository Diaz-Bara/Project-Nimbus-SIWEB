import { getTrackingByAwb } from "@/lib/actions";
import TrackingRouteMapDynamic from "./TrackingRouteMapDynamic";

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

        {shipment ? (
          <TrackingRouteMapDynamic
            origin={shipment.origin}
            destination={shipment.destination}
            status={shipment.status}
            originLat={shipment.origin_lat ? Number(shipment.origin_lat) : undefined}
            originLng={shipment.origin_lng ? Number(shipment.origin_lng) : undefined}
            destLat={shipment.dest_lat ? Number(shipment.dest_lat) : undefined}
            destLng={shipment.dest_lng ? Number(shipment.dest_lng) : undefined}
          />
        ) : (
          <div className="h-40 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs text-gray-400">
            No shipment data
          </div>
        )}
      </div>
    </div>
  );
}