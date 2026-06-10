"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
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

const CITY_ALIASES: Record<string, string> = {
  jakarta: "CGK",
  singapore: "SIN",
  "hong kong": "HKG",
  tokyo: "NRT",
  narita: "NRT",
  bali: "DPS",
  denpasar: "DPS",
  surabaya: "SUB",
  medan: "KNO",
  balikpapan: "BPN",
  london: "LHR",
};

function resolveCoords(cityName: string): [number, number] | null {
  if (!cityName) return null;
  const upper = cityName.toUpperCase().trim();
  if (CITY_COORDS[upper]) return CITY_COORDS[upper];
  const lower = cityName.toLowerCase().trim();
  for (const [alias, code] of Object.entries(CITY_ALIASES)) {
    if (lower.includes(alias)) return CITY_COORDS[code];
  }
  return null;
}

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

function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("deliver")) return "#22c55e";
  if (s.includes("cancel")) return "#ef4444";
  if (s.includes("transit")) return "#3b82f6";
  return "#f59e0b";
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
};

export default function TrackingRouteMapClient({ origin, destination, status }: Props) {
  const originCoords = useMemo(() => resolveCoords(origin), [origin]);
  const destinationCoords = useMemo(() => resolveCoords(destination), [destination]);

  const progress = getProgress(status);
  const cargoColor = getStatusColor(status);

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
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <BoundsFitter bounds={bounds} />

        {/* Garis rute penuh abu-abu putus */}
        <Polyline
          positions={[originCoords, destinationCoords]}
          pathOptions={{ color: "#cbd5e1", weight: 2, dashArray: "6 5", opacity: 0.8 }}
        />

        {/* Garis progress biru solid */}
        {cargoPosition && (
          <Polyline
            positions={[originCoords, cargoPosition]}
            pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.95 }}
          />
        )}

        {/* Titik origin - hijau */}
        <CircleMarker
          center={originCoords}
          radius={7}
          pathOptions={{ color: "#1d4ed8", fillColor: "#22c55e", fillOpacity: 0.95, weight: 2 }}
        >
          <Popup>
            <span className="text-sm font-semibold text-green-700">Origin</span><br />
            <span className="text-xs text-gray-600">{origin}</span>
          </Popup>
        </CircleMarker>

        {/* Titik destination - oranye */}
        <CircleMarker
          center={destinationCoords}
          radius={7}
          pathOptions={{ color: "#1d4ed8", fillColor: "#f97316", fillOpacity: 0.95, weight: 2 }}
        >
          <Popup>
            <span className="text-sm font-semibold text-orange-600">Destination</span><br />
            <span className="text-xs text-gray-600">{destination}</span>
          </Popup>
        </CircleMarker>

        {/* Posisi cargo saat ini */}
        {cargoPosition && (
          <CircleMarker
            center={cargoPosition}
            radius={9}
            pathOptions={{ color: "#fff", fillColor: cargoColor, fillOpacity: 1, weight: 2.5 }}
          >
            <Popup>
              <span className="text-sm font-semibold">Cargo Position</span><br />
              <span className="text-xs text-gray-600">{status}</span>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}