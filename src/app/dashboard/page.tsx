"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatsCard from "@/components/dashboard/StatsCard";
import FlightList from "@/components/dashboard/FlightList";
import CargoTable from "@/components/dashboard/CargoTable";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Dashboard() {
  return (
    <div className="h-screen flex overflow-hidden">

      <Sidebar />

      <div className="flex-1 px-6 py-4">
        <Topbar />

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <StatsCard title="Active Cargo" value="1,284" sub="⤴️+12% vs Yesterday" />
          <StatsCard title="Fleet Efficiency" value="98.2%" sub="💿Optimal Range" />
          <StatsCard title="Current Delay" value="14m" sub="At CGK Terminal" />
          <StatsCard title="On-Time Index" value="A-" sub="Reviewed 2m ago" />
        </div>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-6">
            <FlightList />
          </div>

          <div className="md:col-span-2">
            <CargoTable />
          </div>
        </div>

      </div>
    </div>
  );
}
