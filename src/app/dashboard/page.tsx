import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import FlightList from "@/components/dashboard/FlightList";
import CargoTable from "@/components/dashboard/CargoTable";
import DashboardFlightMap from "@/components/dashboard/DashboardFlightMap";
import CargoProgressChart from "@/components/dashboard/CargoProgressChart";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <Topbar />
        <Suspense fallback={<div className="grid md:grid-cols-4 gap-4 mt-6">{[1,2,3,4].map(i => <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-[104px] animate-pulse"><div className="h-3 w-1/2 bg-gray-200 rounded mb-4"></div><div className="h-7 w-3/4 bg-gray-200 rounded mb-2"></div></div>)}</div>}>
          <DashboardStats />
        </Suspense>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-6">
            <Suspense fallback={<div className="h-64 bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"><div className="h-4 w-1/3 bg-gray-200 rounded mb-6"></div></div>}>
              <FlightList />
            </Suspense>
          </div>
          <div className="md:col-span-2">
            <Suspense fallback={<div className="h-64 bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"><div className="h-5 w-1/4 bg-gray-200 rounded mb-6"></div></div>}>
              <CargoTable />
            </Suspense>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Suspense fallback={<div className="bg-white rounded-xl shadow-sm border border-gray-100 h-80 animate-pulse flex items-center justify-center"><span className="text-gray-300">Loading map...</span></div>}>
            <DashboardFlightMap />
          </Suspense>
          <Suspense fallback={<div className="bg-white rounded-xl shadow-sm border border-gray-100 h-80 animate-pulse flex items-center justify-center"><span className="text-gray-300">Loading chart...</span></div>}>
            <CargoProgressChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
