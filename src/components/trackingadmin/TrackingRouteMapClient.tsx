"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  Marker,
  useMap,
} from "react-leaflet";
import L, { type LatLngBoundsExpression, type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAirportCoords, getShipmentStatusColor, calculateBearing } from "@/lib/airport-coords";

function interpolatePosition(
  origin: [number, number],
  destination: [number, number],
  progress: number
): [number, number] {
  return [
    origin[0] + (destination[0] - origin[0]) * progress,
    origin[1] + (destination[1] - origin[1]) * progress,
  ];
}

function getProgress(status: string): number {
  const s = status.toLowerCase();
  if (s.includes("deliver")) return 1.0;
  if (s.includes("transit")) return 0.55;
  if (s.includes("sort")) return 0.25;
  if (s.includes("receiv")) return 0.05;
  if (s.includes("cancel")) return 0.0;
  return 0.1;
}

function BoundsFitter({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (bounds && !fitted.current) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
      fitted.current = true;
    }
  }, [bounds, map]);
  return null;
}

type Props = {
  origin: string;
  destination: string;
  status: string;
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
};

// Aircraft icon with dynamic rotation support
const createAircraftIcon = (bearing: number, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>`;
  return L.divIcon({
    html: `<div style="transform: rotate(${bearing - 90}deg); width: 24px; height: 24px;">${svg}</div>`,
    className: "aircraft-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function TrackingRouteMapClient({ origin, destination, status, originLat, originLng, destLat, destLng }: Props) {
  const originCoords: [number, number] | null = useMemo(() => {
    if (originLat && originLng) return [originLat, originLng];
    // Fallback: parse code from "CODE - City"
    const match = origin.match(/^([a-zA-Z]{2,4})\s*-/);
    return getAirportCoords(match ? match[1] : origin);
  }, [origin, originLat, originLng]);

  const destinationCoords: [number, number] | null = useMemo(() => {
    if (destLat && destLng) return [destLat, destLng];
    const match = destination.match(/^([a-zA-Z]{2,4})\s*-/);
    return getAirportCoords(match ? match[1] : destination);
  }, [destination, destLat, destLng]);

  const progress = getProgress(status);
  const routeColor = getShipmentStatusColor(status);

  const cargoPosition: [number, number] | null = useMemo(() => {
    if (!originCoords || !destinationCoords) return null;
    return interpolatePosition(originCoords, destinationCoords, progress);
  }, [originCoords, destinationCoords, progress]);

  const bounds: LatLngBoundsExpression | null = useMemo(() => {
    if (!originCoords || !destinationCoords) return null;
    return [originCoords, destinationCoords];
  }, [originCoords, destinationCoords]);

  const mapCenter: LatLngExpression = useMemo(() => {
    if (originCoords && destinationCoords) {
      return [
        (originCoords[0] + destinationCoords[0]) / 2,
        (originCoords[1] + destinationCoords[1]) / 2,
      ];
    }
    return originCoords ?? destinationCoords ?? [2, 110];
  }, [originCoords, destinationCoords]);

  const bearing = useMemo(() => {
    if (!originCoords || !destinationCoords) return 0;
    return calculateBearing(originCoords, destinationCoords);
  }, [originCoords, destinationCoords]);

  if (!originCoords || !destinationCoords) {
    return (
      <div className="h-40 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-sm text-gray-400">
        {origin} → {destination}
      </div>
    );
  }

  return (
    <div className="h-40 rounded-lg overflow-hidden z-0">
      <MapContainer
        key={`${origin}-${destination}`}
        center={mapCenter}
        zoom={4}
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundsFitter bounds={bounds} />

        <Polyline
          positions={[originCoords, destinationCoords]}
          pathOptions={{
            color: routeColor,
            weight: 3,
            opacity: 0.8,
            dashArray: "6 6",
          }}
        />

        {/* Start Point */}
        <CircleMarker
          center={originCoords}
          radius={5}
          pathOptions={{
            color: "#1d4ed8",
            fillColor: "#3b82f6",
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Popup className="text-xs font-semibold">{origin}</Popup>
        </CircleMarker>

        {/* End Point */}
        <CircleMarker
          center={destinationCoords}
          radius={5}
          pathOptions={{
            color: "#1d4ed8",
            fillColor: "#f97316",
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Popup className="text-xs font-semibold">{destination}</Popup>
        </CircleMarker>

        {/* Aircraft Icon representing shipment location */}
        {cargoPosition && progress > 0 && progress < 1 && (
          <Marker position={cargoPosition} icon={createAircraftIcon(bearing, routeColor)}>
             <Popup>
              <div className="text-xs text-center">
                <p className="font-bold">{status}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}