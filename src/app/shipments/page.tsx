"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import ShipmentStats from "@/components/shipments/ShipmentStats";
import ShipmentTable from "@/components/shipments/ShipmentTable";
import ShipmentModal from "@/components/shipments/ShipmentModal";

type Shipment = {
  id: number;
  awb: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
};

export default function ShipmentsPage() {
  const [data, setData] = useState<Shipment[]>([
    {
      id: 1,
      awb: "PET-48201-QX",
      origin: "Jakarta",
      destination: "Singapore",
      weight: 425,
      pieces: 12,
      status: "In Transit",
    },
    {
      id: 2,
      awb: "PET-11023-AL",
      origin: "Surabaya",
      destination: "Melbourne",
      weight: 1120,
      pieces: 48,
      status: "Pending QC",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Shipment | null>(null);

  // CREATE / UPDATE
 const handleSave = (item: Shipment) => {
  if (item.id) {
    setData(data.map((d: Shipment) => (d.id === item.id ? item : d)));
  } else {
    setData([...data, { ...item, id: Date.now() }]);
  }
  setOpen(false);
  setEditItem(null);
};
  // DELETE
  const handleDelete = (id: number) => {
    setData(data.filter((d: Shipment) => d.id !== id));
  };

  return (
    <div className="h-screen flex bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">

          {/* TITLE */}
          <h1 className="text-xl font-bold text-blue-900 mb-1">
            Shipment Central
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Real-time logistics monitoring and freight management.
          </p>

          {/* STATS */}
          <ShipmentStats />

          {/* TABLE */}
          <ShipmentTable
            data={data}
            onEdit={(item: Shipment) => {
            setEditItem(item);
            setOpen(true);
        }}
            onDelete={handleDelete}
            onCreate={() => setOpen(true)}
          />

        </div>
      </div>

      {/* MODAL */}
      {open && (
        <ShipmentModal
          data={editItem}
          onClose={() => {
            setOpen(false);
            setEditItem(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}