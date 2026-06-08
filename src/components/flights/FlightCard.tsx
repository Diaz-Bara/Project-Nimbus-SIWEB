import { ReactNode } from "react";

type Flight = {
  id: number;
  code: string;
  aircraft: string;
  origin_code: string;
  origin_city: string;
  departure_time: string;
  destination_code: string;
  destination_city: string;
  arrival_time: string;
  status: string;
  progress: number;
};

export default function FlightCard({
  flight,
  actions,
}: {
  flight: Flight;
  actions?: ReactNode;
}) {
  const status = flight.status.toLowerCase();
  const color =
    status === "active"
      ? "bg-green-500"
      : status.includes("delay")
      ? "bg-orange-500"
      : "bg-gray-300";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">

      {/* LEFT */}
      <div>
        <p className="text-xs text-gray-400">FLIGHT NO</p>
        <p className="font-semibold text-blue-700">{flight.code}</p>
        <p className="text-xs text-gray-400">{flight.aircraft}</p>
      </div>

      {/* FROM */}
      <div className="text-center">
        <p className="font-semibold">{flight.origin_code}</p>
        <p className="text-xs text-gray-400">{flight.origin_city}</p>
        <p className="text-xs">{flight.departure_time}</p>
      </div>

      {/* PROGRESS */}
      <div className="flex-1 mx-4">
        <div className="h-1 bg-gray-200 rounded relative">
          <div
            className={`h-1 rounded ${color}`}
            style={{ width: `${flight.progress}%` }}
          />
        </div>
      </div>

      {/* TO */}
      <div className="text-center">
        <p className="font-semibold">{flight.destination_code}</p>
        <p className="text-xs text-gray-400">{flight.destination_city}</p>
        <p className="text-xs">{flight.arrival_time}</p>
      </div>

      {actions && (
        <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
}
