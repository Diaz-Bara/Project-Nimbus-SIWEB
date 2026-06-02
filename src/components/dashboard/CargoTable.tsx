import { fetchRecentShipments } from "@/lib/actions";

export default async function CargoTable() {
  const shipments = await fetchRecentShipments(5);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Today's Incoming Cargo</h3>

      <table className="w-full text-sm">
        <thead className="text-gray-500">
          <tr>
            <th className="text-left">AWB</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {shipments.length === 0 ? (
            <tr className="border-t">
              <td colSpan={5} className="py-4 text-center text-gray-400">
                No shipment data yet.
              </td>
            </tr>
          ) : (
            shipments.map((shipment) => (
              <tr key={shipment.id} className="border-t text-center">
                <td className="py-2 text-left">{shipment.awb}</td>
                <td>{shipment.origin}</td>
                <td>{shipment.destination}</td>
                <td className="text-blue-500">{shipment.status}</td>
                <td>
                  {shipment.created_at
                    ? new Date(shipment.created_at).toLocaleDateString("id-ID")
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
