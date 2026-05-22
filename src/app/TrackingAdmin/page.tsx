import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import TrackingTimeline from "@/components/trackingadmin/TrackingTimeline";
import TrackingSidebar from "@/components/trackingadmin/TrackingSidebar";
import TrackingHeader from "@/components/trackingadmin/TrackingHeader"; // <-- Import Header baru
import { Suspense } from "react";

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
          <h1 className="text-xl font-bold text-blue-900">AWB Tracking</h1>
          <p className="text-sm text-gray-500 mb-6">
            Track your airway bill precision-timed shipments across our global network
          </p>

          {/* SEARCH + CARD DENGAN SUSPENSE */}
          <Suspense
            fallback={
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm h-[112px] animate-pulse flex flex-col gap-3 justify-center">
                  <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                  <div className="h-9 w-full bg-gray-200 rounded-lg"></div>
                </div>
                <div className="bg-blue-900 p-4 rounded-xl shadow-sm h-[112px] animate-pulse flex flex-col gap-2 justify-center">
                  <div className="h-4 w-1/2 bg-blue-800 rounded"></div>
                  <div className="h-3 w-full bg-blue-800 rounded"></div>
                  <div className="h-3 w-3/4 bg-blue-800 rounded"></div>
                </div>
              </div>
            }
          >
            <TrackingHeader />
          </Suspense>

          {/* MAIN CONTENT DENGAN SUSPENSE */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* TIMELINE */}
            <div className="md:col-span-2">
              <Suspense
                fallback={
                  <div className="bg-white rounded-xl shadow-sm p-6 h-[400px] animate-pulse flex flex-col gap-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-4 h-4 bg-gray-200 rounded-full mt-1"></div>
                        <div className="flex-1">
                          <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <TrackingTimeline />
              </Suspense>
            </div>

            {/* DETAIL / SIDEBAR */}
            <div className="space-y-6">
              <Suspense
                fallback={
                  <>
                    <div className="bg-white p-4 rounded-xl shadow-sm h-[130px] animate-pulse flex flex-col gap-3 justify-center">
                      <div className="h-3 w-1/3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm h-[200px] animate-pulse flex flex-col gap-3">
                      <div className="h-3 w-1/3 bg-gray-200 rounded mb-2"></div>
                      <div className="flex-1 bg-gray-100 rounded-lg"></div>
                    </div>
                  </>
                }
              >
                <TrackingSidebar />
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}