export const dynamic = "force-dynamic";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ShipmentForm from "@/components/shipments/ShipmentForm";
import { notFound } from "next/navigation";
import { fetchFlightNetworkCities, fetchShipmentById } from "@/lib/actions";

export default async function EditShipmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [shipment, availableCities] = await Promise.all([
    fetchShipmentById(Number(params.id)),
    fetchFlightNetworkCities(),
  ]);
  if (!shipment) { notFound(); }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4"><Topbar /></div>
        <div className="px-6 pb-6 overflow-y-auto">
          <div className="mb-6 mt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Shipment Central</p>
            <h1 className="text-[28px] text-[#0a327d]">
              Shipment Central/<span className="font-bold">Manage Shipments</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Edit and update shipment details for an existing airway bill.</p>
          </div>
          <ShipmentForm data={shipment as any} availableCities={availableCities} />
        </div>
      </div>
    </div>
  );
}