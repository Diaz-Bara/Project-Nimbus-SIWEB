import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import FlightSearch from "@/components/flights/FlightSearch";
import FlightList from "@/components/flights/FlightList";
import FlightsListSkeleton from "@/components/flights/FlightSkeleton";
import { Suspense } from "react";
import FlightMap from "@/components/flights/FlightMap";
import { fetchFlightsPages } from "@/lib/actions";

export default async function FlightsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFlightsPages(query);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4"><Topbar /></div>
        <div className="px-6 pb-6 overflow-y-auto">
          <p className="text-xs text-gray-400">FLEET OPERATIONS</p>
          <h1 className="text-2xl font-bold text-blue-900 mb-6">Flights Schedule</h1>
          <div className="mb-6">
            <Suspense fallback={<div className="h-[42px] w-full bg-gray-200 rounded-lg animate-pulse"></div>}>
              <FlightSearch />
            </Suspense>
          </div>
          <div className="mb-6">
            <Suspense key={query + currentPage} fallback={<FlightsListSkeleton />}>
              <FlightList query={query} currentPage={currentPage} />
            </Suspense>
          </div>
          <div className="mt-6">
            <Suspense fallback={<div className="bg-white rounded-xl shadow-sm h-80 animate-pulse flex items-center justify-center"><span className="text-gray-300">Loading map...</span></div>}>
              <FlightMap />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
