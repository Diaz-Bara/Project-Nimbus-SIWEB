type Flight = {
  id: number;
  code: string;
  aircraft: string;
  from: string;
  fromCity: string;
  timeFrom: string;
  to: string;
  toCity: string;
  timeTo: string;
  status: "active" | "delay" | "scheduled";
  progress: number;
};

export default function FlightCard({ flight }: { flight: Flight }) {
  const color =
    flight.status === "active"
      ? "bg-green-500"
      : flight.status === "delay"
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
        <p className="font-semibold">{flight.from}</p>
        <p className="text-xs text-gray-400">{flight.fromCity}</p>
        <p className="text-xs">{flight.timeFrom}</p>
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
        <p className="font-semibold">{flight.to}</p>
        <p className="text-xs text-gray-400">{flight.toCity}</p>
        <p className="text-xs">{flight.timeTo}</p>
      </div>
    </div>
  );
}