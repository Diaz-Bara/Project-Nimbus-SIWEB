import { getTrackingByAwb } from "@/lib/actions";

function getStepStyle(
  stepStatus: string,
  shipmentStatus: string,
  isLast: boolean
) {
  const s = shipmentStatus.toLowerCase();
  const isDelivered = s.includes("deliver");
  const isCancelled = s.includes("cancel");

  // Jika shipment sudah Delivered atau Cancelled, semua step dianggap selesai
  if (isDelivered || isCancelled) {
    return {
      dotClass: isDelivered ? "bg-green-500" : "bg-red-400",
      lineClass: "bg-gray-200",
    };
  }

  // Kalau masih in-progress, hanya step terakhir yang aktif (biru)
  if (isLast) {
    return { dotClass: "bg-blue-600", lineClass: "bg-gray-200" };
  }

  return { dotClass: "bg-gray-300", lineClass: "bg-gray-200" };
}

export default async function TrackingTimeline({ awb }: { awb: string }) {
  const result = (await getTrackingByAwb(awb)) as any;
  const history = result?.success ? result.history : [];
  const shipment = result?.success ? result.shipment : null;
  const shipmentStatus: string = shipment?.status || "";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-400 mb-4">JOURNEY STATUS</p>

      {result && !result.success ? (
        <p className="text-sm text-red-600">{result.error}</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-gray-500">No tracking logs available for this AWB.</p>
      ) : (
        <div className="space-y-6">
          {history.map((step: any, i: number) => {
            const isLast = i === history.length - 1;
            const { dotClass, lineClass } = getStepStyle(step.status, shipmentStatus, isLast);

            return (
              <div key={`${step.status}-${i}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${dotClass}`} />
                  {!isLast && <div className={`w-[2px] h-10 ${lineClass}`} />}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-sm">{step.status}</p>
                  <p className="text-xs text-gray-500">
                    {step.location || "-"} - {step.note || "-"}
                  </p>
                </div>

                <p className="text-xs text-gray-400">
                  {step.created_at ? new Date(step.created_at).toLocaleString("id-ID") : "-"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}