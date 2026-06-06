import FlightCard from "@/components/flights/FlightCard";
import { fetchFlights } from "@/lib/actions";

export default async function FlightList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const flights = await fetchFlights(query, currentPage);

  return (
    <div className="space-y-4">
      {flights.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada penerbangan yang cocok.</p>
      ) : (
        flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))
      )}
    </div>
  );
}
