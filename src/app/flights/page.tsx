import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import Pagination from "@/components/pagination";
import FlightInteractive from "@/components/flights/FlightInteractive";
import FlightsSearchBar from "@/components/flights/FlightsSearchBar";
import { Suspense } from "react";
import FlightMap from "@/components/flights/FlightMap";
import { fetchFlights, fetchFlightsPages } from "@/lib/actions";

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
  const flights = await fetchFlights(query, currentPage);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">
          <DashboardPageHeader
            eyebrow="Fleet Operations"
            title="Flights Schedule"
            subtitle="Manage scheduled flights and live route coverage."
          />

          <FlightsSearchBar placeholder="Search flight code or destination (e.g. Tokyo or PT-882)..." />

          <div className="mb-6" key={query + currentPage}>
            <FlightInteractive initialFlights={flights} />
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          )}

          <div className="mt-6 w-full">
            <Suspense
              fallback={
                <div className="bg-white rounded-xl shadow-sm h-96 animate-pulse flex items-center justify-center">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                </div>
              }
            >
              <FlightMap />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}