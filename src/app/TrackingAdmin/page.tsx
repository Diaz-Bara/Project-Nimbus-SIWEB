import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import TrackingTimeline from "@/components/trackingadmin/TrackingTimeline";
import TrackingSidebar from "@/components/trackingadmin/TrackingSidebar";
import TrackingHeader from "@/components/trackingadmin/TrackingHeader";
import AwbNotFoundCard from "@/components/errors/AwbNotFoundCard";
import { getTrackingByAwb } from "@/lib/actions";
import { Suspense } from "react";

export default async function TrackingPage(props: {
  searchParams?: Promise<{
    awb?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const awb = searchParams?.awb?.trim() || "";
  let awbNotFound: string | null = null;

  if (awb) {
    const tracking = await getTrackingByAwb(awb);
    if (!tracking.success) {
      awbNotFound = awb;
    }
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">
          <DashboardPageHeader
            eyebrow="Tracking Logs"
            title="AWB Tracking"
            subtitle="Track airway bill shipments across our global network."
          />

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
            <TrackingHeader awb={awb} />
          </Suspense>

          {awbNotFound && (
            <div className="max-w-lg mx-auto mt-2">
              <AwbNotFoundCard
                awb={awbNotFound}
                backHref="/TrackingAdmin"
                backLabel="Back to AWB Tracking"
              />
            </div>
          )}

          {awb && !awbNotFound && (
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-3">
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
                  <TrackingTimeline awb={awb} />
                </Suspense>
              </div>

              <div className="md:col-span-2 space-y-6">
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
                  <TrackingSidebar awb={awb} />
                </Suspense>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


