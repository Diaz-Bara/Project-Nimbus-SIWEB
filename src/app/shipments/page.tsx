import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import ShipmentStats from "@/components/shipments/ShipmentStats";
import SearchWrapper from "@/components/SearchWrapper";
import Pagination from "@/components/pagination";
import ShipmentList from "@/components/shipments/ShipmentList";
import ShipmentTableSkeleton from "@/components/shipments/ShipmentSkeleton";
import { Suspense } from "react";
import { fetchShipmentsPages } from "@/lib/actions";

export default async function ShipmentsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchShipmentsPages(query);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Topbar />
        </div>
        <div className="px-6 pb-6 overflow-y-auto">
          <DashboardPageHeader
            eyebrow="Freight Management"
            title="Shipment Central"
            subtitle="Real-time logistics monitoring and freight management."
          />

{/* STATS DENGAN SUSPENSE */}
          <Suspense 
            fallback={
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-5 rounded-xl shadow-sm h-[96px] animate-pulse flex flex-col justify-center">
                    <div className="h-3 w-1/2 bg-gray-200 rounded mb-3"></div>
                    <div className="h-7 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            }
          >
            <ShipmentStats />
          </Suspense>

          {/* SEARCH AREA */}
          <div className="mt-6 mb-4">
            <Suspense fallback={<div className="h-[42px] w-full bg-gray-200 rounded-lg animate-pulse"></div>}>
              <SearchWrapper placeholder="Search by AWB, origin, or destination..." />
            </Suspense>
          </div>

          {/* LIST DENGAN SKELETON LOADING (GABUNGAN DATA & CRUD) */}
          <Suspense key={query + currentPage} fallback={<ShipmentTableSkeleton />}>
            <ShipmentList query={query} currentPage={currentPage} />
          </Suspense>

          {/* PAGINATION (BARU) */}
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
