import {
  fetchFlightNetworkCities,
  fetchFlightsForNetworkMap,
} from "@/lib/actions";
import FlightMapDynamic from "./FlightMapDynamic";

export default async function FlightMap() {
  const [flights, cities] = await Promise.all([
    fetchFlightsForNetworkMap(),
    fetchFlightNetworkCities(),
  ]);

  return <FlightMapDynamic flights={flights} cities={cities} />;
}