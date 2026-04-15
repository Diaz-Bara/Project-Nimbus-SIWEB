export default function VisionMission() {
  return (
    <section className="py-20 px-6 bg-gray-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Visi & Misi
        </h2>

        <div className="w-16 h-1 bg-orange-400 mx-auto mt-2 mb-8 rounded"></div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Visi */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Visi
            </h3>
            <p className="text-gray-600">
              Menjadi perusahaan ekspedisi udara terdepan yang memberikan
              layanan cepat, aman, dan terpercaya di tingkat nasional
              maupun internasional.
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Misi
            </h3>
            <ul className="text-gray-600 list-disc pl-5 space-y-2">
              <li>Memberikan layanan pengiriman yang cepat dan efisien</li>
              <li>Menjamin keamanan dan kualitas barang</li>
              <li>Mengembangkan teknologi tracking modern</li>
              <li>Meningkatkan kepuasan pelanggan</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}