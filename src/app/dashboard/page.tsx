import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardStats from "@/components/dashboard/DashboardStats"; // <-- Import komponen baru
import FlightList from "@/components/dashboard/FlightList";
import CargoTable from "@/components/dashboard/CargoTable";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <Topbar />

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
      </div>
    </div>
  );
}