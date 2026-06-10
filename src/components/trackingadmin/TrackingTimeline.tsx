import { getTrackingByAwb } from "@/lib/actions";

function getStepStyle(
  stepStatus: string,
  shipmentStatus: string,
  isFirst: boolean
) {
  const s = shipmentStatus.toLowerCase();
  const isDelivered = s.includes("deliver");
  const isCancelled = s.includes("cancel");

  if (isDelivered || isCancelled) {
    return {
      dotClass: isDelivered ? "bg-green-500" : "bg-red-400",
      lineClass: "bg-gray-200",
    };
  }

  if (isFirst) {
    return { dotClass: "bg-blue-600", lineClass: "bg-gray-200" };
  }

  return { dotClass: "bg-gray-300", lineClass: "bg-gray-200" };
}

function formatCustomDateTime(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  const time = d.toLocaleTimeString("id-ID");
  return `${mm}/${dd}/${yyyy}, ${time}`;
}

// 💡 Fungsi baru: Menghasilkan kalimat statis tanpa mengambil dari database
function getStaticNote(status: string) {
  const s = status.toLowerCase();
  if (s.includes("receive")) return "Cargo has been received and registered.";
  if (s.includes("sortation")) return "Cargo is being processed at the sorting facility.";
  if (s.includes("transit")) return "Cargo is currently in transit to the next hub.";
  if (s.includes("deliver")) return "Cargo has been delivered successfully.";
  if (s.includes("cancel")) return "Cargo shipment has been cancelled.";
  return "Shipment status has been updated.";
}

export default async function TrackingTimeline({ awb }: { awb: string }) {
  const result = (await getTrackingByAwb(awb)) as any;
  const history = result?.success ? result.history : [];
  const shipment = result?.success ? result.shipment : null;
  const shipmentStatus: string = shipment?.status || "";
  
  const reversedHistory = [...history].reverse();

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs font-semibold text-gray-400 mb-4">TRACKING HISTORY</p>

      {result && !result.success ? (
        <p className="text-sm text-red-600">{result.error}</p>
      ) : reversedHistory.length === 0 ? (
        <p className="text-sm text-gray-500">No tracking logs available for this AWB.</p>
      ) : (
        <div className="space-y-6">
          {reversedHistory.map((step: any, i: number) => {
            const isFirst = i === 0; 
            const isLastItemInList = i === reversedHistory.length - 1; 
            const { dotClass, lineClass } = getStepStyle(step.status, shipmentStatus, isFirst);

            return (
              <div key={`${step.status}-${i}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${dotClass} mt-1`} />
                  {!isLastItemInList && <div className={`w-[2px] h-10 ${lineClass}`} />}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-sm">{step.status}</p>
                  {/* 💡 Menggunakan kalimat statis, mengabaikan data lokasi database */}
                  <p className="text-xs text-gray-500">
                    {getStaticNote(step.status)}
                  </p>
                </div>

                <p className="text-xs text-gray-400 mt-0.5">
                  {formatCustomDateTime(step.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}