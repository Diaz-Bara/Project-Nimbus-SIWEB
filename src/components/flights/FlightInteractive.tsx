"use client";

import { useState } from "react";
import FlightCard from "./FlightCard";
import FlightModal from "./FlightModal";

type Flight = {
  id: number;
  code: string;
  aircraft: string;
  origin_code: string;
  origin_city: string;
  destination_code: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  progress: number;
  capacity_tons: number;
  used_tons: number;
};

export default function FlightInteractive({ flights }: { flights: Flight[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "detail">("create");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleOpen = (mode: "create" | "edit" | "detail", flight?: Flight) => {
    setModalMode(mode);
    setSelectedFlight(flight || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <button onClick={() => handleOpen("create")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + New Flight
        </button>
      </div>

      {flights.length === 0 ? (
        <p className="text-gray-500 italic text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">No flights found.</p>
      ) : (
        flights.map((flight) => (
          <div key={flight.id} className="flex items-center gap-2 group">
            <div className="flex-1">
              <FlightCard flight={flight} />
            </div>
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <button onClick={() => handleOpen("detail", flight)} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Detail">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
              <button onClick={() => handleOpen("edit", flight)} className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50" title="Edit">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => alert(`Delete ${flight.code} triggered`)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50" title="Delete">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))
      )}

      <FlightModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedFlight}
        mode={modalMode}
      />
    </div>
  );
}
