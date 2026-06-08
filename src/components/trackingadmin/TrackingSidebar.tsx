import { getTrackingByAwb } from "@/lib/actions";
import TrackingLocationMapDynamic from "@/components/trackingadmin/TrackingLocationMapDynamic";

export default async function TrackingSidebar({ awb }: { awb: string }) {
  const result = (await getTrackingByAwb(awb)) as any;
  const shipment = result?.success ? result.shipment : null;
  const lastLocation =
    result?.success && result.history?.length
      ? result.history[result.history.length - 1]?.location
      : undefined;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400 mb-2">SHIPMENT DETAILS</p>

        {result && !result.success ? (
          <p className="text-sm text-red-600">{result.error}</p>
        ) : !shipment ? (
          <p className="text-sm text-gray-500">No shipment selected.</p>
        ) : (
          <>
            <p className="text-sm font-bold text-blue-700 mb-3">{shipment.awb}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Origin</span>
                <span className="font-medium">{shipment.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Destination</span>
                <span className="font-medium">{shipment.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recipient</span>
                <span className="font-medium">{shipment.recipient_name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone</span>
                <span className="font-medium">{shipment.phone_number || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Item Type</span>
                <span className="font-medium">{shipment.item_type || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Weight</span>
                <span className="font-medium">{shipment.weight} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service Level</span>
                <span className="font-medium">{shipment.service_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping Price</span>
                <span className="font-medium text-green-600">
                  Rp {Number(shipment.price || 0).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping Date</span>
                <span className="font-medium">
                  {shipment.shipping_date
                    ? new Date(shipment.shipping_date).toLocaleDateString("id-ID")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Flight Code</span>
                <span className="font-medium text-blue-600">
                  {shipment.flight_code || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Aircraft</span>
                <span className="font-medium">{shipment.flight_aircraft || "-"}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-400">Status</span>
                <span
                  className={`font-semibold ${
                    shipment.status === "In Transit"
                      ? "text-blue-600"
                      : shipment.status === "Delivered"
                        ? "text-green-600"
                        : shipment.status === "Cancelled"
                          ? "text-red-500"
                          : "text-orange-500"
                  }`}
                >
                  {shipment.status}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400 mb-2">CURRENT LOCATION MAP</p>

        {shipment ? (
          <TrackingLocationMapDynamic
            destination={shipment.destination}
            status={shipment.status}
            lastLocation={lastLocation}
          />
        ) : (
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Map Preview
          </div>
        )}
      </div>
    </div>
  );
}