"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PencilIcon, TrashIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { deleteShipmentAction } from "@/lib/actions";

type Shipment = {
  id: number;
  awb: string;
  sender_name?: string;
  recipient_name?: string;
  origin: string;
  destination: string;
  item_type?: string;
  weight: number;
  price?: number;
  service_level?: string;
  status: string;
};

export default function ShipmentInteractive({ 
  initialData, 
  isManagePage = false 
}: { 
  initialData: Shipment[],
  isManagePage?: boolean
}) {
  const [data, setData] = useState<Shipment[]>(initialData);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleDeleteClick = (id: number) => {
    setShipmentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDetailClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDetailModalOpen(true);
  };

  const confirmDelete = async () => {
    if (shipmentToDelete !== null) {
      const previousData = data;
      setData(data.filter((d: Shipment) => d.id !== shipmentToDelete));

      const result = await deleteShipmentAction(shipmentToDelete);
      if (!result.success) {
        setData(previousData);
        alert(result.error || "Failed to delete shipment.");
      }
    }
    setIsDeleteModalOpen(false);
    setShipmentToDelete(null);
  };

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold">Active Freight</p>
          {!isManagePage && (
            <Link
              href="/shipments/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              + Create Shipment
            </Link>
          )}
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-400 text-xs">
            <tr className="text-center border-b">
              <th className="pb-3">AWB</th>
              <th className="pb-3">Sender</th>
              <th className="pb-3">Recipient</th>
              <th className="pb-3">Origin</th>
              <th className="pb-3">Destination</th>
              <th className="pb-3">Item</th>
              <th className="pb-3">Weight</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0 text-center">
                <td className="py-3">{item.awb}</td>
                <td className="py-3">{item.sender_name || "-"}</td>
                <td className="py-3">{item.recipient_name || "-"}</td>
                <td className="py-3">{item.origin}</td>
                <td className="py-3">{item.destination}</td>
                <td className="py-3">{item.item_type || "-"}</td>
                <td className="py-3">{item.weight}</td>
                <td
                  className={`py-3 font-medium ${
                    item.status === "In Transit" || item.status === "In-Transit"
                      ? "text-blue-600"
                      : item.status === "Scheduled"
                      ? "text-orange-500"
                      : "text-[#0a327d]"
                  }`}
                >
                  {item.status}
                </td>
                <td className="py-3 space-x-3">
                  {isManagePage ? (
                    <>
                      <Link
                        href={`/shipments/${item.id}/edit`}
                        className="inline-block text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Shipment"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item.id)}
                        className="inline-block text-red-500 hover:text-red-700 transition-colors"
                        title="Delete Shipment"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDetailClick(item)}
                        className="inline-block text-[#0a327d] hover:text-blue-800 transition-colors"
                        title="Detail Shipment"
                      >
                        <InformationCircleIcon className="w-5 h-5" />
                      </button>
                      <Link
                        href={`/shipments/${item.id}/edit`}
                        className="inline-block text-blue-500 hover:text-blue-700 transition-colors"
                        title="Edit Shipment"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item.id)}
                        className="inline-block text-red-500 hover:text-red-700 transition-colors"
                        title="Delete Shipment"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-semibold text-[#1a2332] mb-2">
              Delete Confirmation
            </h3>
            <p className="text-gray-500 mb-8">
              Are you sure you want to delete this shipment data?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#1a2332]">Shipment Detail</h3>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">AWB / Tracking No.</span>
                <span className="font-bold text-blue-700">{selectedShipment.awb}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Sender</span>
                <span className="font-medium">{selectedShipment.sender_name || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Recipient</span>
                <span className="font-medium">{selectedShipment.recipient_name || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Origin</span>
                <span className="font-medium">{selectedShipment.origin}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Destination</span>
                <span className="font-medium">{selectedShipment.destination}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Item Type</span>
                <span className="font-medium">{selectedShipment.item_type || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Weight</span>
                <span className="font-medium">{selectedShipment.weight} KG</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Service Level</span>
                <span className="font-medium">{selectedShipment.service_level || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Shipping Price</span>
                <span className="font-medium text-green-700">
                  Rp {(selectedShipment.price || 0).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold ${
                  selectedShipment.status === "In Transit" || selectedShipment.status === "In-Transit"
                    ? "text-blue-600"
                    : selectedShipment.status === "Delivered"
                    ? "text-green-600"
                    : selectedShipment.status === "Cancelled"
                    ? "text-red-500"
                    : "text-orange-500"
                }`}>
                  {selectedShipment.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#0a327d] hover:bg-blue-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}