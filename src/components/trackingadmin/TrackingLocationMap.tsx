"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CITY_COORDS: Record<string, [number, number]> = {
  CGK: [-6.1256, 106.6558],
  SIN: [1.3521, 103.8198],
  HKG: [22.3080, 113.9185],
  NRT: [35.7720, 140.3929],
  DPS: [-8.7482, 115.1672],
  SUB: [-7.3797, 112.7872],
  KNO: [3.6417, 98.8853],
  BPN: [-1.2681, 116.8942],
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
};

function resolveDestinationCoords(destination: string): [number, number] | null {
  if (!destination) return null;

  const upper = destination.toUpperCase();
  for (const code of Object.keys(CITY_COORDS)) {
    if (upper.includes(code)) {
      return CITY_COORDS[code];
    }
  }

  const lower = destination.toLowerCase();
  for (const [alias, code] of Object.entries(CITY_ALIASES)) {
    if (lower.includes(alias)) {
      return CITY_COORDS[code];
    }
  }

  return null;
}

type TrackingLocationMapProps = {
  destination: string;
  status?: string;
  lastLocation?: string;
};

export default function TrackingLocationMap({
  destination,
  status,
  lastLocation,
}: TrackingLocationMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  const coords = useMemo(() => {
    return (
      resolveDestinationCoords(lastLocation || "") ||
      resolveDestinationCoords(destination)
    );
  }, [destination, lastLocation]);

  const label = lastLocation || destination || "Unknown location";

  if (!mounted) {
    return (
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
        Loading map...
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm text-center px-4">
        {destination || "Map Preview"}
      </div>
    );
  }

  return (
    <div className="h-48 rounded-lg overflow-hidden border border-gray-100">
      <MapContainer
        center={coords}
        zoom={10}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>
            <span className="font-semibold">{label}</span>
            {status ? (
              <>
                <br />
                <span className="text-sm text-gray-600">{status}</span>
              </>
            ) : null}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}