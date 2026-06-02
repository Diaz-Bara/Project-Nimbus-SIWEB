import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ShipmentForm from "@/components/shipments/ShipmentForm";
import ShipmentList from "@/components/shipments/ShipmentList";
import SearchWrapper from "@/components/SearchWrapper";
import Pagination from "@/components/pagination";
import ShipmentTableSkeleton from "@/components/shipments/ShipmentSkeleton";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchShipmentById, fetchShipmentsPages } from "@/lib/actions";

export default async function EditShipmentPage(props: { 
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const id = params.id;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchShipmentsPages(query);
  const shipment = await fetchShipmentById(Number(id));

  if (!shipment) {
    notFound();
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Topbar />
        </div>
        
        <div className="px-6 pb-6 overflow-y-auto">
          <div className="mb-8 mt-2">
            <h1 className="text-[28px] text-[#0a327d]">
              Shipment Central/<span className="font-bold">Manage Shipments</span>
            </h1>
          </div>
          
          <ShipmentForm data={shipment as any} />
          
          <div className="mt-8">
            {/* SEARCH AREA */}
            <div className="mb-4">
              <Suspense fallback={<div className="h-[42px] w-full bg-gray-200 rounded-lg animate-pulse"></div>}>
                <SearchWrapper placeholder="Cari kode penerbangan atau destinasi..." />
              </Suspense>
            </div>

            {/* TABEL DENGAN SKELETON */}
            <Suspense key={query + currentPage} fallback={<ShipmentTableSkeleton />}>
              <ShipmentList query={query} currentPage={currentPage} isManagePage={true} />
            </Suspense>

            {/* PAGINATION */}
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
