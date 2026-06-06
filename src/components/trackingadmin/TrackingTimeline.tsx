import { getTrackingByAwb } from "@/lib/actions";

export default async function TrackingTimeline({ awb }: { awb: string }) {
  const result = (await getTrackingByAwb(awb)) as any;
  const history = result?.success ? result.history : [];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-400 mb-4">JOURNEY STATUS</p>

      {result && !result.success ? (
        <p className="text-sm text-red-600">{result.error}</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-gray-500">No tracking logs available for this AWB.</p>
      ) : (
        <div className="space-y-6">
          {history.map((step: any, i: number) => (
            <div key={`${step.status}-${i}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${i === history.length - 1 ? "bg-blue-600" : "bg-gray-300"}`} />
                {i !== history.length - 1 && <div className="w-[2px] h-10 bg-gray-200" />}
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
          ))}
        </div>
      )}
    </div>
  );
}
