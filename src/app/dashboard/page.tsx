import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import FlightList from "@/components/dashboard/FlightList";
import CargoTable from "@/components/dashboard/CargoTable";
import DashboardFlightMap from "@/components/dashboard/DashboardFlightMap";
import CargoProgressChart from "@/components/dashboard/CargoProgressChart";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">
        <DashboardPageHeader
          eyebrow="Operations Overview"
          title="Dashboard"
          subtitle="Real-time cargo metrics and fleet activity."
        />

        {/* STATS SECTION DENGAN SUSPENSE */}
        <Suspense
          fallback={
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              {/* Membuat 4 kotak skeleton berkedip sejajar */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-[104px] animate-pulse">
                  <div className="h-3 w-1/2 bg-gray-200 rounded mb-4"></div>
                  <div className="h-7 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-1/3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          }
        >
          <DashboardStats />
        </Suspense>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          
          {/* KOLOM KIRI: FLIGHT LIST */}
          <div className="space-y-6">
            <Suspense 
              fallback={
                <div className="h-64 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
                    <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
                    <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              }
            >
              <FlightList />
            </Suspense>
          </div>

          {/* KOLOM KANAN: CARGO TABLE */}
          <div className="md:col-span-2">
            <Suspense 
              fallback={
                <div className="h-64 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
              }
            >
              <CargoTable />
            </Suspense>
          </div>

        </div>

        {/* BAGIAN BAWAH: MAP + CHART */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Suspense
            fallback={
              <div className="bg-white rounded-xl shadow-sm h-72 animate-pulse flex items-center justify-center">
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
              </div>
            }
          >
            <DashboardFlightMap />
          </Suspense>

          <Suspense
            fallback={
              <div className="bg-white rounded-xl shadow-sm h-72 animate-pulse p-6">
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-4" />
                <div className="flex items-end gap-2 h-48">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gray-100 rounded"
                      style={{ height: `${i * 20}%` }}
                    />
                  ))}
                </div>
              </div>
            }
          >
            <CargoProgressChart />
          </Suspense>
        </div>
        </div>
      </div>
    </div>
  );
}

