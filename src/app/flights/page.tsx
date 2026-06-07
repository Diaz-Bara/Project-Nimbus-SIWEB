import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import FleetStats from "@/components/flights/FleetStats";
import SearchWrapper from "@/components/SearchWrapper";
import Pagination from "@/components/pagination";
import FlightList from "@/components/flights/FlightList";
import FlightsListSkeleton from "@/components/flights/FlightSkeleton";
import { Suspense } from "react";
import FlightMap from "@/components/flights/FlightMap";
import { fetchFlightsPages } from "@/lib/actions";
import Link from "next/link";

export default async function FlightsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFlightsPages(query);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">
          {/* HEADER */}
          <p className="text-xs text-gray-400">FLEET OPERATIONS</p>
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Flights Schedule
          </h1>

          {/* FILTER & SEARCH */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-3">
              {/* SKELETON UNTUK SEARCH BAR */}
              <Suspense fallback={<div className="h-[42px] w-full bg-gray-200 rounded-lg animate-pulse"></div>}>
                <SearchWrapper placeholder="Cari kode penerbangan atau destinasi (contoh: Tokyo atau PT-882)..." />
              </Suspense>
            </div>
            <Link
              href="/flights?query=ACTIVE&page=1"
              role="button"
              className="bg-white p-3 rounded-lg text-sm shadow-sm flex items-center justify-center font-bold hover:bg-blue-50 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Quick Filters
            </Link>
          </div>

          {/* LIST DENGAN SUSPENSE (SKELETON LOADING) */}
          <div className="mb-6">
            <Suspense 
              key={query + currentPage} 
              fallback={<FlightsListSkeleton />} 
            >
              <FlightList query={query} currentPage={currentPage} />
            </Suspense>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          )}

          {/* BOTTOM */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
           {/* SKELETON UNTUK MAP */}
            <div className="md:col-span-2">
              <Suspense 
                fallback={
                  <div className="bg-white rounded-xl shadow-sm h-64 animate-pulse flex items-center justify-center">
                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                  </div>
                }
              >
                <FlightMap />
              </Suspense>
            </div>
            
            {/* SKELETON UNTUK KOTAK BIRU (LANGKAH 2) */}
            <Suspense 
              fallback={
                <div className="bg-blue-900 p-6 rounded-xl shadow-sm h-full flex flex-col justify-center animate-pulse">
                  <div className="h-3 w-1/2 bg-blue-800 rounded mb-4"></div>
                  <div className="h-10 w-1/3 bg-blue-800 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-blue-800 rounded mb-6"></div>
                  <div className="h-2 w-full bg-blue-800 rounded-full mb-2"></div>
                  <div className="h-3 w-1/3 bg-blue-800 rounded"></div>
                </div>
              }
            >
              <FleetStats />
            </Suspense>

          </div>
        </div>
      </div>
    </div>
  );
}
