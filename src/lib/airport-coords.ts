export const AIRPORT_COORDS: Record<string, [number, number]> = {
  CGK: [-6.1256, 106.6558],
  SIN: [1.3521, 103.8198],
  HKG: [22.308, 113.9185],
  NRT: [35.772, 140.3929],
  DPS: [-8.7482, 115.1672],
  SUB: [-7.3797, 112.7872],
  KNO: [3.6417, 98.8853],
  BPN: [-1.2681, 116.8942],
  LHR: [51.47, -0.4543],
};

export function getFlightStatusColor(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "ACTIVE") return "#22c55e";
  if (normalized.includes("DELAY")) return "#f97316";
  return "#9ca3af";
}

export function getAirportCoords(code: string): [number, number] | null {
  return AIRPORT_COORDS[code?.toUpperCase()] ?? null;
}

export type NetworkFlight = {
  id: number;
  code: string;
  status: string;
  origin_code: string;
  origin_city?: string;
  destination_code: string;
  destination_city?: string;
};

export type PlottedRoute = {
  flight: NetworkFlight;
  origin: [number, number];
  destination: [number, number];
};

export function buildNetworkRoutes(flights: NetworkFlight[]) {
  const routes: PlottedRoute[] = [];
  const airports = new Set<string>();

  for (const flight of flights) {
    const origin = getAirportCoords(flight.origin_code);
    const destination = getAirportCoords(flight.destination_code);
    if (!origin || !destination) continue;

    routes.push({ flight, origin, destination });
    airports.add(flight.origin_code.toUpperCase());
    airports.add(flight.destination_code.toUpperCase());
  }

  return { routes, airportCodes: Array.from(airports) };
}