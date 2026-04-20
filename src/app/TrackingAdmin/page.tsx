"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import TrackingTimeline from "@/components/trackingadmin/TrackingTimeline";
import TrackingSidebar from "@/components/trackingadmin/TrackingSidebar";

export default function TrackingPage() {
  return (
    <div className="h-screen flex bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">

          {/* TITLE */}
          <h1 className="text-xl font-bold text-blue-900">
            AWB Tracking
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Track your airway bill precision-timed shipments across our global network
          </p>

          {/* SEARCH + CARD */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">

            {/* SEARCH */}
            <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm">
              <p className="text-xs text-gray-400 mb-2">
                ENTER TRACKING NUMBER
              </p>

              <div className="flex gap-2">
                <input
                  placeholder="AWB-8802-PETIR-XP"
                  className="flex-1 border px-4 py-2 rounded-lg"
                />
                <button className="bg-blue-700 text-white px-4 rounded-lg">
                  Track Shipment
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Recent: <span className="text-blue-600">AWB-7721-KT-SIN</span>
              </p>
            </div>

            {/* CARD */}
            <div className="bg-blue-900 text-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold mb-1">Express Network</p>
              <p className="text-sm text-blue-200">
                Our AI logistics network maintains 98.8% precision delivery rates
              </p>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* TIMELINE */}
            <div className="md:col-span-2">
              <TrackingTimeline />
            </div>

            {/* DETAIL */}
            <TrackingSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}