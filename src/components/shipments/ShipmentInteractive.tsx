"use client";

import { useState, useEffect } from "react";
import ShipmentTable from "@/components/shipments/ShipmentTable";

type Shipment = {
  id: number;
  awb: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
};

export default function ShipmentInteractive({ initialData }: { initialData: Shipment[] }) {
  const [data, setData] = useState<Shipment[]>(initialData);

  // Jika hasil pencarian dari server berubah, perbarui data tabel
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Fungsi delete sementara menggunakan state lokal
  const handleDelete = (id: number) => {
    setData(data.filter((d: Shipment) => d.id !== id));
  };

  return (
    <>
      <ShipmentTable
        data={data}
        onDelete={handleDelete}
      />
    </>
  );
}