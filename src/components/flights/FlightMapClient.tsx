"use client";

import { useMemo, useState } from "react";
import FlightNetworkMapView from "@/components/maps/FlightNetworkMapView";
import { fieldControlClass } from "@/components/ui/FormField";
import type { NetworkFlight } from "@/lib/airport-coords";

export type FlightNetworkCity = {
  code: string;
  city: string;
};

type FlightMapClientProps = {
  flights: NetworkFlight[];
  cities: FlightNetworkCity[];
};

function formatCityOption(city: FlightNetworkCity) {
  return `${city.code} — ${city.city}`;
}

export default function FlightMapClient({ flights, cities }: FlightMapClientProps) {
  const [originCode, setOriginCode] = useState("");
  const [destinationCode, setDestinationCode] = useState("");

  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const originMatch =
        !originCode ||
        flight.origin_code.toUpperCase() === originCode.toUpperCase();
      const destinationMatch =
        !destinationCode ||
        flight.destination_code.toUpperCase() === destinationCode.toUpperCase();
      return originMatch && destinationMatch;
    });
  }, [flights, originCode, destinationCode]);

  const emptyMessage =
    originCode || destinationCode
      ? "No routes match the selected city combination"
      : "No plottable flight routes";

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Global Flight Network</h3>
          <p className="text-xs text-gray-400">Active routes across the logistics network</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
          {filteredFlights.length} flights
        </span>
      </div>

      <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="flight-map-origin"
            className="block text-xs font-medium text-gray-600 mb-1.5"
          >
            Origin City
          </label>
          <select
            id="flight-map-origin"
            value={originCode}
            onChange={(e) => setOriginCode(e.target.value)}
            className={fieldControlClass(false, "form")}
          >
            <option value="">All origin cities</option>
            {cities.map((city) => (
              <option key={`origin-${city.code}`} value={city.code}>
                {formatCityOption(city)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="flight-map-destination"
            className="block text-xs font-medium text-gray-600 mb-1.5"
          >
            Destination City
          </label>
          <select
            id="flight-map-destination"
            value={destinationCode}
            onChange={(e) => setDestinationCode(e.target.value)}
            className={fieldControlClass(false, "form")}
          >
            <option value="">All destination cities</option>
            {cities.map((city) => (
              <option key={`destination-${city.code}`} value={city.code}>
                {formatCityOption(city)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FlightNetworkMapView
        flights={filteredFlights}
        heightClass="h-80"
        scrollWheelZoom
        emptyMessage={emptyMessage}
      />
      </div>
    </div>
  );
}