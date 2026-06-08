"use client";

import { useEffect, useState } from "react";
import {
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import FlightCard from "./FlightCard";
import FlightFormModal, { FlightFormData } from "./FlightFormModal";
import {
  createFlightAction,
  updateFlightAction,
  deleteFlightAction,
} from "@/lib/actions";

type Flight = {
  id: number;
  code: string;
  aircraft: string;
  origin_code: string;
  origin_city: string;
  departure_time: string;
  destination_code: string;
  destination_city: string;
  arrival_time: string;
  status: string;
  progress: number;
  capacity_tons: number;
  used_tons: number;
};

export default function FlightInteractive({
  initialFlights,
}: {
  initialFlights: Flight[];
}) {
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>(initialFlights);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setFlights(initialFlights);
  }, [initialFlights]);

  const openCreate = () => {
    setSelectedFlight(null);
    setSaveError(null);
    setIsFormOpen(true);
  };

  const openEdit = (flight: Flight) => {
    setSelectedFlight(flight);
    setSaveError(null);
    setIsFormOpen(true);
  };

  const openDetail = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsDetailOpen(true);
  };

  const openDelete = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsDeleteOpen(true);
  };

  const handleSave = async (formData: FlightFormData) => {
    setIsSaving(true);
    setSaveError(null);

    let result: { success: boolean; error?: string };

    if (selectedFlight?.id) {
      result = await updateFlightAction(selectedFlight.id, {
        aircraft: formData.aircraft,
        origin_code: formData.origin_code,
        origin_city: formData.origin_city,
        destination_code: formData.destination_code,
        destination_city: formData.destination_city,
        departure_time: formData.departure_time,
        arrival_time: formData.arrival_time,
        status: formData.status,
        capacity_tons: formData.capacity_tons,
        used_tons: formData.used_tons,
      });
    } else {
      result = await createFlightAction({
        code: formData.code,
        aircraft: formData.aircraft,
        origin_code: formData.origin_code,
        origin_city: formData.origin_city,
        destination_code: formData.destination_code,
        destination_city: formData.destination_city,
        departure_time: formData.departure_time,
        arrival_time: formData.arrival_time,
        status: formData.status,
        capacity_tons: formData.capacity_tons,
        used_tons: formData.used_tons,
      });
    }

    if (!result.success) {
      setSaveError(result.error || "Failed to save flight.");
      setIsSaving(false);
      return;
    }

    router.refresh();
    setIsFormOpen(false);
    setSelectedFlight(null);
    setIsSaving(false);
  };

  const confirmDelete = async () => {
    if (!selectedFlight) return;

    const previous = flights;
    setFlights(flights.filter((f) => f.id !== selectedFlight.id));

    const result = await deleteFlightAction(selectedFlight.id);
    if (!result.success) {
      setFlights(previous);
      alert(result.error || "Failed to delete flight.");
    } else {
      router.refresh();
    }

    setIsDeleteOpen(false);
    setSelectedFlight(null);
  };

  const formFlightData: FlightFormData | null = selectedFlight
    ? {
        id: selectedFlight.id,
        code: selectedFlight.code,
        aircraft: selectedFlight.aircraft,
        origin_code: selectedFlight.origin_code,
        origin_city: selectedFlight.origin_city,
        destination_code: selectedFlight.destination_code,
        destination_city: selectedFlight.destination_city,
        departure_time: selectedFlight.departure_time,
        arrival_time: selectedFlight.arrival_time,
        status: selectedFlight.status,
        capacity_tons: Number(selectedFlight.capacity_tons),
        used_tons: Number(selectedFlight.used_tons),
      }
    : null;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-gray-800">Scheduled Flights</p>
        <button
          type="button"
          onClick={openCreate}
          className="bg-[#0a327d] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Flight
        </button>
      </div>

      <div className="space-y-4">
        {flights.length === 0 ? (
          <p className="text-gray-500 italic">No matching flights found.</p>
        ) : (
          flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => openDetail(flight)}
                    className="text-[#0a327d] hover:text-blue-800 transition-colors p-1"
                    title="Detail Flight"
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(flight)}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                    title="Edit Flight"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDelete(flight)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Delete Flight"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </>
              }
            />
          ))
        )}
      </div>

      <FlightFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedFlight(null);
        }}
        onSave={handleSave}
        flightData={isFormOpen && selectedFlight ? formFlightData : null}
        isSaving={isSaving}
        errorMessage={saveError}
      />

      {isDetailOpen && selectedFlight && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#1a2332]">Flight Detail</h3>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Flight Code</span>
                <span className="font-bold text-blue-700">{selectedFlight.code}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Aircraft</span>
                <span className="font-medium">{selectedFlight.aircraft}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Route</span>
                <span className="font-medium">
                  {selectedFlight.origin_code} ({selectedFlight.origin_city}) →{" "}
                  {selectedFlight.destination_code} ({selectedFlight.destination_city})
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Schedule</span>
                <span className="font-medium">
                  {selectedFlight.departure_time} - {selectedFlight.arrival_time}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Capacity</span>
                <span className="font-medium">
                  {selectedFlight.used_tons} / {selectedFlight.capacity_tons} tons
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-semibold ${
                    selectedFlight.status.toUpperCase() === "ACTIVE"
                      ? "text-green-600"
                      : selectedFlight.status.toUpperCase().includes("DELAY")
                      ? "text-orange-500"
                      : "text-gray-500"
                  }`}
                >
                  {selectedFlight.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#0a327d] hover:bg-blue-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && selectedFlight && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Flight</h3>
            <p className="text-sm text-gray-600 mb-6">
              Delete flight <strong>{selectedFlight.code}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedFlight(null);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}