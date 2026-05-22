import ShipmentForm from "@/components/shipments/ShipmentForm";
import ShipmentList from "@/components/shipments/ShipmentList"; // 🌟 Import tabel kamu

export default async function EditShipmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const dummyData = {
    id: Number(id),
    awb: "PET-49201-9X",
    origin: "Jakarta (CGK)",
    destination: "Singapore (SIN)",
    weight: 425.00,
    pieces: 12,
    status: "In Transit" // Disesuaikan dengan data di tabelmu
  };

  return (
    <main className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-[28px] text-[#0a327d]">
          Shipment Central/<span className="font-bold">Manage Shipments</span>
        </h1>
      </div>
      
      {/* 1. Menampilkan Form Edit yang sudah terisi data */}
      <ShipmentForm data={dummyData} />

      {/* 2. Menampilkan Tabel di Bawah Form */}
      <div className="mt-12">
        <ShipmentList query="" currentPage={1} />
      </div>
    </main>
  );
}