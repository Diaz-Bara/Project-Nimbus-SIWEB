import { fetchDashboardFlights } from "@/lib/actions";
import DashboardFlightMapDynamic from "./DashboardFlightMapDynamic";

export default async function DashboardFlightMap() {
  const flights = await fetchDashboardFlights(10);
  return <DashboardFlightMapDynamic flights={flights} />;
}