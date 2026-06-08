"use client";

import { useMemo, useState } from "react";
import FlightNetworkMapView from "@/components/maps/FlightNetworkMapView";
import FormField, { fieldControlClass } from "@/components/ui/FormField";
import type { NetworkFlight } from "@/lib/airport-coords";

export type FlightNetworkCity = {
  code: string;
  city: string;
};

type FlightMapClientProps = {
  flights: NetworkFlight[];
  cities: FlightNetworkCity[];
};

export default function FlightMapClient({ flights, cities }: FlightMapClientProps) {
  const [originCode, setOriginCode] = useState("");
  const [destinationCode, setDestinationCode] = useState("");

  const originCity = cities.find((city) => city.code === originCode);
  const destinationCity = cities.find((city) => city.code === destinationCode);

  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const originMatch =
        !originCode ||
        flight.origin_code.toUpperCase() === originCode.toUpperCase() ||
        flight.origin_city?.toLowerCase() === originCity?.city.toLowerCase();
      const destinationMatch =
        !destinationCode ||
        flight.destination_code.toUpperCase() === destinationCode.toUpperCase() ||
        flight.destination_city?.toLowerCase() === destinationCity?.city.toLowerCase();
      return originMatch && destinationMatch;
    });
  }, [flights, originCode, destinationCode, originCity, destinationCity]);

  const routePreview =
    originCode && destinationCode
      ? {
          originCode,
          destinationCode,
          originCity: originCity?.city,
          destinationCity: destinationCity?.city,
        }
      : null;

  const emptyMessage =
    originCode || destinationCode
      ? "Selected cities are not available on the map yet"
      : "Select origin and destination cities to preview a route";

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
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Origin City" htmlFor="flight-map-origin" required>
            <select
              id="flight-map-origin"
              value={originCode}
              onChange={(e) => setOriginCode(e.target.value)}
              className={fieldControlClass(false, "form")}
            >
              <option value="">Select origin city</option>
              {cities.map((city) => (
                <option key={`origin-${city.code}`} value={city.code}>
                  {city.city}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Destination City" htmlFor="flight-map-destination" required>
            <select
              id="flight-map-destination"
              value={destinationCode}
              onChange={(e) => setDestinationCode(e.target.value)}
              className={fieldControlClass(false, "form")}
            >
              <option value="">Select destination city</option>
              {cities.map((city) => (
                <option key={`destination-${city.code}`} value={city.code}>
                  {city.city}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FlightNetworkMapView
          flights={filteredFlights}
          routePreview={routePreview}
          heightClass="h-80"
          scrollWheelZoom
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}