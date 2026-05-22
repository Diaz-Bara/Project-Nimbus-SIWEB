import ShipmentForm from "@/components/shipments/ShipmentForm";
import ShipmentList from "@/components/shipments/ShipmentList"; // 🌟 Import tabel kamu

export default function CreateShipmentPage() {
  return (
    <main className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-[28px] text-[#0a327d]">
          Shipment Central/<span className="font-bold">Manage Shipments</span>
        </h1>
      </div>
      
      {/* 1. Menampilkan Form Input */}
      <ShipmentForm />

      {/* 2. Menampilkan Tabel di Bawah Form */}
      <div className="mt-12">
        {/* Menggunakan nilai default query kosong dan halaman 1 */}
        <ShipmentList query="" currentPage={1} />
      </div>
    </main>
  );
}