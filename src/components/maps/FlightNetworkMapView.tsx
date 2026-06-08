"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  buildNetworkRoutes,
  getFlightStatusColor,
  getAirportCoords,
  type NetworkFlight,
} from "@/lib/airport-coords";

function MapBoundsFitter({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
    }
  }, [bounds, map]);

  return null;
}

type FlightNetworkMapViewProps = {
  flights: NetworkFlight[];
  heightClass?: string;
  scrollWheelZoom?: boolean;
  emptyMessage?: string;
};

export default function FlightNetworkMapView({
  flights,
  heightClass = "h-72",
  scrollWheelZoom = false,
  emptyMessage = "No plottable flight routes",
}: FlightNetworkMapViewProps) {
  const { routes, airportCodes } = buildNetworkRoutes(flights);

  const bounds: LatLngBoundsExpression | null =
    routes.length > 0
      ? routes.flatMap(({ origin, destination }) => [origin, destination])
      : null;

  const mapCenter: LatLngExpression = routes.length ? routes[0].origin : [2, 110];

  if (routes.length === 0) {
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
        {routes.map(({ flight, origin, destination }) => (
          <Polyline
            key={flight.id}
            positions={[origin, destination]}
            pathOptions={{
              color: getFlightStatusColor(flight.status),
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
        ))}
        {airportCodes.map((code) => {
          const coords = getAirportCoords(code);
          if (!coords) return null;

          return (
            <CircleMarker
              key={code}
              center={coords}
              radius={6}
              pathOptions={{
                color: "#1d4ed8",
                fillColor: "#3b82f6",
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