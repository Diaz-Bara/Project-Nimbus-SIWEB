import { fetchRecentShipments } from "@/lib/actions";

export default async function TrackingHeader({ awb }: { awb: string }) {
  const recent = await fetchRecentShipments(1);
  const recentAwb = recent[0]?.awb;

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm">
        <p className="text-xs text-gray-400 mb-2">ENTER TRACKING NUMBER</p>
        <form action="/TrackingAdmin" className="flex gap-2">
          <input
            name="awb"
            defaultValue={awb}
            placeholder="Enter AWB number"
            className="flex-1 border border-gray-200 px-4 py-2 rounded-lg text-sm"
          />
          <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
            Track Shipment
          </button>
        </form>
        {recentAwb && (
          <p className="text-xs text-gray-400 mt-2">
            Recent:{" "}
            <a className="text-blue-600 hover:underline" href={`/TrackingAdmin?awb=${encodeURIComponent(recentAwb)}`}>
              {recentAwb}
            </a>
          </p>
        )}
      </div>

      <div className="bg-blue-900 text-white p-4 rounded-xl shadow-sm flex flex-col justify-center">
        <p className="font-semibold mb-1">Express Network</p>
        <p className="text-sm text-blue-200">
          Providing real-time cargo visibility across our integrated logistics network with optimized routing and operational excellence.
        </p>
      </div>
    </div>
  );
}
