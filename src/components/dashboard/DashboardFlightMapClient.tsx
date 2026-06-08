"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Popup, CircleMarker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const CITY_COORDS: Record<string, [number, number]> = {
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

function getStatusColor(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "ACTIVE") return "#22c55e";
  if (normalized.includes("DELAY")) return "#f97316";
  return "#9ca3af";
}

type DashboardFlight = {
  id: number;
  code: string;
  status: string;
  origin_code: string;
  destination_code: string;
};

export default function DashboardFlightMapClient({
  flights,
}: {
  flights: DashboardFlight[];
}) {
  const { routes, airportCodes } = useMemo(() => {
    const plotted: {
      flight: DashboardFlight;
      origin: [number, number];
      destination: [number, number];
    }[] = [];
    const airports = new Set<string>();

    for (const flight of flights) {
      const origin = CITY_COORDS[flight.origin_code];
      const destination = CITY_COORDS[flight.destination_code];
      if (!origin || !destination) continue;

      plotted.push({ flight, origin, destination });
      airports.add(flight.origin_code);
      airports.add(flight.destination_code);
    }

    return { routes: plotted, airportCodes: Array.from(airports) };
  }, [flights]);

  const mapCenter: LatLngExpression = routes.length
    ? routes[0].origin
    : [2, 110];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-400 mb-3">
        ACTIVE FLIGHT ROUTES ({routes.length})
      </p>
      <div className="h-72 rounded-lg overflow-hidden z-0">
        <MapContainer
          center={mapCenter}
          zoom={4}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {routes.map(({ flight, origin, destination }) => (
            <Polyline
              key={flight.id}
              positions={[origin, destination]}
              pathOptions={{
                color: getStatusColor(flight.status),
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
            const coords = CITY_COORDS[code];
            if (!coords) return null;

            return (
              <CircleMarker
                key={code}
                center={coords}
                radius={5}
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
    </div>
  );
}