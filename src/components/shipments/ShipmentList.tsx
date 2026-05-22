import ShipmentInteractive from "@/components/shipments/ShipmentInteractive";

type Shipment = {
  id: number;
  awb: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
};

export default async function ShipmentList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // Simulasi loading 1.5 detik agar Skeleton terlihat
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const rawData: Shipment[] = [
    { id: 1, awb: "PET-48201-QX", origin: "Jakarta", destination: "Singapore", weight: 425, pieces: 12, status: "In Transit" },
    { id: 2, awb: "PET-11023-AL", origin: "Surabaya", destination: "Melbourne", weight: 1120, pieces: 48, status: "Pending QC" },
  ];

  const filteredData = rawData.filter((item) =>
    item.awb.toLowerCase().includes(query.toLowerCase()) ||
    item.origin.toLowerCase().includes(query.toLowerCase()) ||
    item.destination.toLowerCase().includes(query.toLowerCase())
  );

  return <ShipmentInteractive initialData={filteredData} />;
}