// Fallback coordinate cache — DB airports table is the primary source
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

/** Shipment status-based route colors (Task 3) */
export function getShipmentStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("deliver")) return "#22c55e"; // Green
  if (s.includes("cancel")) return "#ef4444";  // Red
  if (s.includes("transit") || s.includes("schedule")) return "#3b82f6";  // Blue
  return "#f59e0b"; // Amber for other statuses
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
  origin_lat?: number;
  origin_lng?: number;
  dest_lat?: number;
  dest_lng?: number;
};

export type ShipmentRoute = {
  id: number;
  awb: string;
  status: string;
  origin: string;
  destination: string;
  origin_code: string;
  destination_code: string;
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
};

export type PlottedRoute = {
  flight: NetworkFlight;
  origin: [number, number];
  destination: [number, number];
};

export type PlottedShipmentRoute = {
  shipment: ShipmentRoute;
  origin: [number, number];
  destination: [number, number];
};

export function buildNetworkRoutes(flights: NetworkFlight[]) {
  const routes: PlottedRoute[] = [];
  const airports = new Set<string>();

  for (const flight of flights) {
    // Prefer DB coordinates, fallback to hardcoded
    const origin: [number, number] | null =
      flight.origin_lat && flight.origin_lng
        ? [flight.origin_lat, flight.origin_lng]
        : getAirportCoords(flight.origin_code);
    const destination: [number, number] | null =
      flight.dest_lat && flight.dest_lng
        ? [flight.dest_lat, flight.dest_lng]
        : getAirportCoords(flight.destination_code);
    if (!origin || !destination) continue;

    routes.push({ flight, origin, destination });
    airports.add(flight.origin_code.toUpperCase());
    airports.add(flight.destination_code.toUpperCase());
  }

  return { routes, airportCodes: Array.from(airports) };
}

export function buildShipmentRoutes(shipments: ShipmentRoute[]) {
  const routes: PlottedShipmentRoute[] = [];

  for (const shipment of shipments) {
    if (!shipment.origin_lat || !shipment.origin_lng || !shipment.dest_lat || !shipment.dest_lng) continue;
    routes.push({
      shipment,
      origin: [shipment.origin_lat, shipment.origin_lng],
      destination: [shipment.dest_lat, shipment.dest_lng],
    });
  }

  return routes;
}

/** Calculate bearing between two points for aircraft icon rotation */
export function calculateBearing(
  from: [number, number],
  to: [number, number]
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const lat1 = toRad(from[0]);
  const lat2 = toRad(to[0]);
  const dLng = toRad(to[1] - from[1]);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}