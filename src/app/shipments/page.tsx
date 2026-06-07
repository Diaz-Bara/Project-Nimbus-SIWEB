import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ShipmentStats from "@/components/shipments/ShipmentStats";
import ShipmentList from "@/components/shipments/ShipmentList";
import ShipmentTableSkeleton from "@/components/shipments/ShipmentSkeleton";
import { Suspense } from "react";

export default async function ShipmentsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4"><Topbar /></div>
        <div className="px-6 pb-6 overflow-y-auto">
          <h1 className="text-xl font-bold text-blue-900 mb-1">Shipment Central</h1>
          <p className="text-sm text-gray-500 mb-6">Real-time logistics monitoring and freight management.</p>
          <Suspense fallback={<div className="grid md:grid-cols-4 gap-4 mb-6">{[1,2,3,4].map(i => <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-[96px] animate-pulse"><div className="h-3 w-1/2 bg-gray-200 rounded mb-3"></div><div className="h-7 w-1/4 bg-gray-200 rounded"></div></div>)}</div>}>
            <ShipmentStats />
          </Suspense>
          <div className="mt-6">
            <Suspense key={query + currentPage} fallback={<ShipmentTableSkeleton />}>
              <ShipmentList query={query} currentPage={currentPage} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
