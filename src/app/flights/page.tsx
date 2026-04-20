"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import FlightCard from "@/components/flights/FlightCard";
import FleetStats from "@/components/flights/FleetStats";

export default function FlightsPage() {
  const flights = [
    {
      id: 1,
      code: "PT-882",
      aircraft: "Boeing 777-F",
      from: "CGK",
      fromCity: "Jakarta",
      timeFrom: "08:45 AM",
      to: "SIN",
      toCity: "Singapore",
      timeTo: "10:30 AM",
      status: "active",
      progress: 65,
    },
    {
      id: 2,
      code: "PT-914",
      aircraft: "Airbus A330-200F",
      from: "SIN",
      fromCity: "Singapore",
      timeFrom: "11:15 AM",
      to: "HKG",
      toCity: "Hong Kong",
      timeTo: "03:45 PM",
      status: "delay",
      progress: 20,
    },
    {
      id: 3,
      code: "PT-115",
      aircraft: "Boeing 747-8F",
      from: "CGK",
      fromCity: "Jakarta",
      timeFrom: "01:00 PM",
      to: "NRT",
      toCity: "Tokyo",
      timeTo: "09:15 PM",
      status: "scheduled",
      progress: 0,
    },
    {
      id: 4,
      code: "PT-552",
      aircraft: "Airbus A350-F",
      from: "HKG",
      fromCity: "Hong Kong",
      timeFrom: "04:20 PM",
      to: "LHR",
      toCity: "London",
      timeTo: "05:10 AM",
      status: "active",
      progress: 25,
    },
  ];

  return (
    <div className="h-screen flex bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">

          {/* HEADER */}
          <p className="text-xs text-gray-400">FLEET OPERATIONS</p>
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Flights Schedule
          </h1>

          {/* FILTER */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-3 rounded-lg text-sm shadow-sm">
              Departure Airport <br />
              <b>Soekarno-Hatta (CGK)</b>
            </div>
            <div className="bg-white p-3 rounded-lg text-sm shadow-sm">
              Arrival Airport <br />
              <b>Any Destination</b>
            </div>
            <div className="bg-white p-3 rounded-lg text-sm shadow-sm">
              Schedule Date <br />
              <b>Today, 24 Oct</b>
            </div>
            <div className="bg-white p-3 rounded-lg text-sm shadow-sm">
              Quick Filters
            </div>
          </div>

          {/* LIST
          <div className="space-y-4 mb-6">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div> */}

          {/* BOTTOM */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm h-64 flex items-center justify-center text-gray-400">
              🌍 Live Global Network (Map Placeholder)
            </div>

            <FleetStats />
          </div>

        </div>
      </div>
    </div>
  );
}