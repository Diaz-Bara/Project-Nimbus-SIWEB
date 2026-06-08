export const dynamic = "force-dynamic";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ShipmentForm from "@/components/shipments/ShipmentForm";
import { fetchFlightNetworkCities } from "@/lib/actions";

export default async function CreateShipmentPage() {
  const availableCities = await fetchFlightNetworkCities();
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4"><Topbar /></div>
        <div className="px-6 pb-6 overflow-y-auto">
          <div className="mb-6 mt-2">
            <h1 className="text-[28px] text-[#0a327d]">
              Shipment Central/<span className="font-bold">Manage Shipments</span>
            </h1>
          </div>
          <ShipmentForm availableCities={availableCities} />
        </div>
      </div>
    </div>
  );
}
