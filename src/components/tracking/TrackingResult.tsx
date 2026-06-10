import TrackingLocationMapDynamic from "@/components/trackingadmin/TrackingLocationMapDynamic";

export type TrackingShipment = {
  awb: string;
  status: string;
  service_level: string;
  weight: number;
  price?: number;
  shipping_date?: string | Date | null;
  description?: string | null;
  item_type?: string;
  origin: string;
  destination: string;
  recipient_name: string;
  phone_number?: string;
  flight_code?: string | null;
  flight_aircraft?: string | null;
  flight_origin?: string | null;
  flight_destination?: string | null;
  flight_status?: string | null;
};

export type TrackingHistoryItem = {
  status: string;
  location: string;
  note: string;
  created_at: string;
};

type TrackingResultProps = {
  shipment: TrackingShipment;
  history: TrackingHistoryItem[];
};

function statusColor(status: string) {
  if (status === "In Transit") return "text-blue-600";
  if (status === "Delivered") return "text-green-600";
  if (status === "Cancelled") return "text-red-500";
  return "text-orange-500";
}

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

function formatCustomDateOnly(dateStr: string | Date | null | undefined) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
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

export default function TrackingResult({ shipment, history }: TrackingResultProps) {
  const lastLocation =
    history.length > 0 ? history[history.length - 1]?.location : undefined;
    
  const reversedHistory = [...history].reverse();

  return (
    <div className="w-full max-w-2xl mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b pb-4 mb-4">
        <div>
          <p className="text-xs text-gray-400">AWB</p>
          <h3 className="text-lg font-bold text-blue-900">{shipment.awb}</h3>
        </div>
        <span
          className={`rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold ${statusColor(shipment.status)}`}
        >
          {shipment.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-3 text-sm mb-5">
        <p>
          Origin: <span className="font-semibold">{shipment.origin}</span>
        </p>
        <p>
          Destination: <span className="font-semibold">{shipment.destination}</span>
        </p>
        <p>
          Recipient:{" "}
          <span className="font-semibold">{shipment.recipient_name || "-"}</span>
        </p>
        <p>
          Phone: <span className="font-semibold">{shipment.phone_number || "-"}</span>
        </p>
        <p>
          Item Type: <span className="font-semibold">{shipment.item_type || "-"}</span>
        </p>
        <p>
          Service: <span className="font-semibold">{shipment.service_level}</span>
        </p>
        <p>
          Weight: <span className="font-semibold">{shipment.weight} KG</span>
        </p>
        <p>
          Shipping Price:{" "}
          <span className="font-semibold text-green-600">
            Rp {Number(shipment.price || 0).toLocaleString("id-ID")}
          </span>
        </p>
        <p>
          Shipping Date:{" "}
          <span className="font-semibold">
            {formatCustomDateOnly(shipment.shipping_date)}
          </span>
        </p>
        <p>
          Flight Code:{" "}
          <span className="font-semibold text-blue-600">
            {shipment.flight_code || "-"}
          </span>
        </p>
        {shipment.flight_status ? (
          <p>
            Flight Status:{" "}
            <span className="font-semibold">{shipment.flight_status}</span>
          </p>
        ) : null}
        {shipment.description ? (
          <p className="md:col-span-2">
            Description: <span className="font-semibold">{shipment.description}</span>
          </p>
        ) : null}
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 mb-2">CURRENT LOCATION</p>
        <TrackingLocationMapDynamic
          destination={shipment.destination}
          status={shipment.status}
          lastLocation={lastLocation}
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 mb-4">TRACKING HISTORY</p>
        {reversedHistory.length === 0 ? (
          <p className="text-sm text-gray-500">No tracking logs available.</p>
        ) : (
          <div className="space-y-6">
            {reversedHistory.map((item, index) => {
              const isFirst = index === 0; 
              const isLastItemInList = index === reversedHistory.length - 1;
              const { dotClass, lineClass } = getStepStyle(item.status, shipment.status, isFirst);

              return (
                <div key={`${item.status}-${index}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${dotClass} mt-1`} />
                    {!isLastItemInList && <div className={`w-[2px] h-10 ${lineClass}`} />}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.status}</p>
                    {/* 💡 Menggunakan kalimat statis, mengabaikan data lokasi database */}
                    <p className="text-xs text-gray-500">
                      {getStaticNote(item.status)}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatCustomDateTime(item.created_at)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}