export default function Organization() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-12">
          Struktur Organisasi
        </h2>

        {/* Ketua */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow">
            Direktur Utama
          </div>
        </div>

        {/* Garis */}
        <div className="flex justify-center mb-4">
          <div className="w-px h-8 bg-gray-400"></div>
        </div>

        {/* Sekretaris & Bendahara */}
        <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
          <div className="bg-gray-100 px-4 py-3 rounded-xl shadow">
            Manajer Operasional
          </div>
          <div className="bg-gray-100 px-4 py-3 rounded-xl shadow">
            Manajer Keuangan
          </div>
        </div>

        {/* Garis bawah */}
        <div className="flex justify-center mt-4 mb-4">
          <div className="w-40 h-px bg-gray-400"></div>
        </div>

        {/* Staff */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-yellow-100 px-3 py-2 rounded-lg shadow">
            Staff Gudang
          </div>
          <div className="bg-yellow-100 px-3 py-2 rounded-lg shadow">
            Staff Logistik
          </div>
          <div className="bg-yellow-100 px-3 py-2 rounded-lg shadow">
            Customer Service
          </div>
        </div>

      </div>
    </section>
  );
}