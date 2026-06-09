import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import Pagination from "@/components/pagination";
import FlightInteractive from "@/components/flights/FlightInteractive";
import FlightsSearchBar from "@/components/flights/FlightsSearchBar";
import { Suspense } from "react";
import FlightMap from "@/components/flights/FlightMap";
import { fetchFlights, fetchFlightsPages } from "@/lib/actions";

// 🚀 1. KOMPONEN SKELETON: Tampilan Animasi Pulse Saat Data Dicari
function FlightsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton Scheduled Flights Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((id) => (
          <div key={id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-gray-200 rounded w-24" />
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>
            
            {/* Jalur Penerbangan Tiruan */}
            <div className="flex items-center justify-between py-2">
              <div className="text-center space-y-1">
                <div className="h-6 bg-gray-200 rounded w-12 mx-auto" />
                <div className="h-3 bg-gray-100 rounded w-16 mx-auto" />
              </div>
              <div className="flex-1 px-4 flex items-center justify-center">
                <div className="w-full h-0.5 bg-gray-200 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-200" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="h-6 bg-gray-200 rounded w-12 mx-auto" />
                <div className="h-3 bg-gray-100 rounded w-16 mx-auto" />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-xs">
              <div className="h-4 bg-gray-100 rounded w-20" />
              <div className="h-4 bg-gray-100 rounded w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🚀 2. KOMPONEN PEMBANTU (DATA FETCHER): Mengambil Data Tanpa Memblokir Seluruh Halaman
async function FlightDataFetcher({ query, currentPage }: { query: string; currentPage: number }) {
  const totalPages = await fetchFlightsPages(query);
  const flights = await fetchFlights(query, currentPage);

  return (
    <>
      <div className="mb-6">
        <FlightInteractive initialFlights={flights} />
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </>
  );
}

// 🚀 3. HALAMAN UTAMA: Cepat, Non-Blocking, Menggunakan Suspense
export default async function FlightsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  // Key untuk memaksa Suspense me-render ulang animasi skeleton setiap kali kata kunci pencarian berubah
  const searchKey = query + currentPage;

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

          {/* SearchBar selalu tampil seketika karena berada di luar Suspense */}
          <FlightsSearchBar placeholder="Search flight code or destination (e.g. Tokyo or PT-882)..." />

          {/* Suspense akan mencegat proses loading data dan menampilkan FlightsSkeleton */}
          <Suspense key={searchKey} fallback={<FlightsSkeleton />}>
            <FlightDataFetcher query={query} currentPage={currentPage} />
          </Suspense>

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