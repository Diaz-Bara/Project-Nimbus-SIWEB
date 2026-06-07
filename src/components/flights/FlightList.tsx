import FlightInteractive from "./FlightInteractive";
import { fetchFlights } from "@/lib/actions";

export default async function FlightList({ query, currentPage }: { query: string; currentPage: number }) {
  const flights = await fetchFlights(query, currentPage);
  return <FlightInteractive flights={flights as any} />;
}
