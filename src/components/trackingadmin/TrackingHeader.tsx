import { fetchRecentShipments } from "@/lib/actions";
import TrackingAdminSearchForm from "@/components/trackingadmin/TrackingAdminSearchForm";

export default async function TrackingHeader({ awb }: { awb: string }) {
  const recent = await fetchRecentShipments(1);
  const recentAwb = recent[0]?.awb;

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <TrackingAdminSearchForm initialAwb={awb} recentAwb={recentAwb} />

      <div className="bg-blue-900 text-white p-4 rounded-xl shadow-sm flex flex-col justify-center">
        <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">
          Live Cargo Network
        </p>
        <p className="font-semibold text-base mb-1">Real-Time AWB Tracking</p>
        <p className="text-sm text-blue-200 leading-relaxed">
          Shipment status is synchronized directly with our cargo database and
          flight operations in real time.
        </p>
      </div>
    </div>
  );
}