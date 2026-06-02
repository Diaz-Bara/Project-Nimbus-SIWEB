import { fetchTrackingOverview } from "@/lib/actions";

export default async function TrackingSidebar() {
  const overview = await fetchTrackingOverview();
  const shipment = overview.shipment;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400 mb-2">SHIPMENT DETAILS</p>

        {!shipment ? (
          <p className="text-sm text-gray-500">No shipment selected.</p>
        ) : (
          <>
            <p className="text-sm">
              AWB: <span className="font-semibold text-blue-600">{shipment.awb}</span>
            </p>
            <p className="text-sm mt-2">Origin: {shipment.origin}</p>
            <p className="text-sm">Destination: {shipment.destination}</p>
            <p className="text-sm">Status: {shipment.status}</p>
          </>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400 mb-2">CURRENT LOCATION MAP</p>

        <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          {shipment ? shipment.destination : "Map Preview"}
        </div>
      </div>
    </div>
  );
}
