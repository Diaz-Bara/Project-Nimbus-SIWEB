"use client";

import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
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
};

function getStatusColor(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "ACTIVE") return "#22c55e";
  if (normalized.includes("DELAY")) return "#f97316";
  return "#9ca3af";
}

type FlightMapFlight = {
  id: number;
  code: string;
  status: string;
  origin_code: string;
  destination_code: string;
};

export default function FlightMapClient({
  flights,
}: {
  flights: FlightMapFlight[];
}) {
  return (
    <div className="h-96 rounded-lg overflow-hidden z-0">
      <MapContainer
        center={[2, 110]}
        zoom={4}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {flights.map((flight) => {
          const origin = CITY_COORDS[flight.origin_code];
          const destination = CITY_COORDS[flight.destination_code];
          if (!origin || !destination) return null;

          const color = getStatusColor(flight.status);

          return (
            <Polyline
              key={flight.id}
              positions={[origin, destination]}
              pathOptions={{ color, weight: 4 }}
            >
              <Popup>
                <div className="text-sm space-y-1">
                  <p className="font-bold text-blue-700">{flight.code}</p>
                  <p className="text-gray-600">
                    {flight.origin_code} → {flight.destination_code}
                  </p>
                  <p style={{ color }} className="font-semibold">
                    {flight.status}
                  </p>
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>
    </div>
  );
}