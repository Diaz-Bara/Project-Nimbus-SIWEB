"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Popup,
  CircleMarker,
  Marker,
  useMap,
} from "react-leaflet";
import L, { type LatLngBoundsExpression, type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  buildNetworkRoutes,
  getFlightStatusColor,
  getAirportCoords,
  calculateBearing,
  type NetworkFlight,
} from "@/lib/airport-coords";

const createAircraftIcon = (bearing: number, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>`;
  return L.divIcon({
    html: `<div style="transform: rotate(${bearing - 90}deg); width: 24px; height: 24px;">${svg}</div>`,
    className: "aircraft-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapBoundsFitter({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
    }
  }, [bounds, map]);

  return null;
}

export type RoutePreview = {
  originCode: string;
  destinationCode: string;
  originCity?: string;
  destinationCity?: string;
};

type FlightNetworkMapViewProps = {
  flights: NetworkFlight[];
  routePreview?: RoutePreview | null;
  heightClass?: string;
  scrollWheelZoom?: boolean;
  emptyMessage?: string;
};

export default function FlightNetworkMapView({
  flights,
  routePreview = null,
  heightClass = "h-72",
  scrollWheelZoom = false,
  emptyMessage = "No plottable flight routes",
}: FlightNetworkMapViewProps) {
  const { routes, airportCodes } = buildNetworkRoutes(flights);

  const previewSegment = useMemo(() => {
    if (!routePreview) return null;

    const origin = getAirportCoords(routePreview.originCode);
    const destination = getAirportCoords(routePreview.destinationCode);
    if (!origin || !destination) return null;

    return { origin, destination, routePreview };
  }, [routePreview]);

  const highlightedAirports = useMemo(() => {
    const codes = new Set(airportCodes);
    if (routePreview?.originCode) codes.add(routePreview.originCode.toUpperCase());
    if (routePreview?.destinationCode) codes.add(routePreview.destinationCode.toUpperCase());
    return Array.from(codes);
  }, [airportCodes, routePreview]);

  const bounds: LatLngBoundsExpression | null = useMemo(() => {
    const points: [number, number][] = routes.flatMap(({ origin, destination }) => [
      origin,
      destination,
    ]);

    if (previewSegment) {
      points.push(previewSegment.origin, previewSegment.destination);
    }

    return points.length > 0 ? points : null;
  }, [routes, previewSegment]);

  const mapCenter: LatLngExpression = previewSegment
    ? previewSegment.origin
    : routes.length
      ? routes[0].origin
      : [2, 110];

  const hasRenderableMap = routes.length > 0 || previewSegment;

  if (!hasRenderableMap) {
    return (
      <div
        className={`${heightClass} rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-sm text-gray-400`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`${heightClass} rounded-lg overflow-hidden z-0`}>
      <MapContainer
        key={`${routePreview?.originCode || "all"}-${routePreview?.destinationCode || "all"}-${routes.length}`}
        center={mapCenter}
        zoom={4}
        className="h-full w-full"
        scrollWheelZoom={scrollWheelZoom}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsFitter bounds={bounds} />
        {previewSegment && (
          <Polyline
            positions={[previewSegment.origin, previewSegment.destination]}
            pathOptions={{
              color: "#2563eb",
              weight: 4,
              opacity: 0.95,
              dashArray: routes.length === 0 ? "8 6" : undefined,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-blue-700">Selected Route</p>
                <p className="text-gray-600">
                  {routePreview?.originCity || previewSegment.routePreview.originCode} →{" "}
                  {routePreview?.destinationCity || previewSegment.routePreview.destinationCode}
                </p>
              </div>
            </Popup>
          </Polyline>
        )}
        {routes.map(({ flight, origin, destination }) => {
          const bearing = calculateBearing(origin, destination);
          const color = getFlightStatusColor(flight.status);
          const progress = 0.5; // Fixed at middle for generic flight map or map to flight.progress if available
          const cargoPosition: [number, number] = [
            origin[0] + (destination[0] - origin[0]) * progress,
            origin[1] + (destination[1] - origin[1]) * progress,
          ];

          return (
            <div key={flight.id}>
              <Polyline
                positions={[origin, destination]}
                pathOptions={{
                  color: color,
                  weight: 3,
                  opacity: 0.85,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-blue-700">{flight.code}</p>
                    <p className="text-gray-600">
                      {flight.origin_code} → {flight.destination_code}
                    </p>
                    <p className="text-gray-500">{flight.status}</p>
                  </div>
                </Popup>
              </Polyline>
              <Marker position={cargoPosition} icon={createAircraftIcon(bearing, color)}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{flight.code}</p>
                    <p className="text-xs text-gray-500">{flight.status}</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
        {highlightedAirports.map((code) => {
          const coords = getAirportCoords(code);
          if (!coords) return null;

          const isSelectedOrigin = routePreview?.originCode.toUpperCase() === code;
          const isSelectedDestination = routePreview?.destinationCode.toUpperCase() === code;

          return (
            <CircleMarker
              key={code}
              center={coords}
              radius={isSelectedOrigin || isSelectedDestination ? 8 : 6}
              pathOptions={{
                color: isSelectedOrigin || isSelectedDestination ? "#1d4ed8" : "#1d4ed8",
                fillColor: isSelectedOrigin
                  ? "#22c55e"
                  : isSelectedDestination
                    ? "#f97316"
                    : "#3b82f6",
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup>
                <span className="text-sm font-semibold">{code}</span>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}