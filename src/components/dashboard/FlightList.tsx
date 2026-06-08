import { fetchDashboardFlights } from "@/lib/actions";

export default async function FlightList() {
  const flights = await fetchDashboardFlights();

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Active Flights</h3>

      <div className="space-y-3 text-sm">
        {flights.length === 0 ? (
          <p className="text-gray-500">No flight data yet.</p>
        ) : (
          flights.map((flight) => (
            <div key={flight.id} className="p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-blue-800">{flight.code}</span>
                <span className="text-xs uppercase text-gray-500">{flight.status}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {flight.origin_code} to {flight.destination_code} | {flight.departure_time} - {flight.arrival_time}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
