import Link from "next/link";

type Shipment = {
  id: number;
  awb: string;
  sender_name?: string;
  recipient_name?: string;
  weight: number;
  price: number;
  status: string;
  shipping_date: string;
  service_level: string;
  origin: string;
  destination: string;
};

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    "In Transit": "bg-blue-100 text-blue-700 border-blue-200",
    "Delivered": "bg-green-100 text-green-700 border-green-200",
    "Cancelled": "bg-red-100 text-red-700 border-red-200",
    "Pending QC": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Scheduled": "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${colorMap[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

export default function ShipmentTable({ shipments }: { shipments: Shipment[] }) {
  if (!shipments || shipments.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-400 text-sm">No shipment data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">AWB</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Origin</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Destination</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shipments.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{item.awb}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.origin}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.destination}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/shipments/${item.id}/edit`} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Detail">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </Link>
                    <Link href={`/shipments/${item.id}/edit`} className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </Link>
                    <Link href={`/shipments/${item.id}/edit`} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
