export default function Services() {
  const services = [
    {
      title: "Pelacakan Kargo",
      desc: "Pantau status pengiriman Anda secara real-time melalui sistem pelacakan terintegrasi",
    },
    {
      title: "Monitoring Penerbangan",
      desc: "Pantau status penerbangan kargo secara real-time untuk memastikan ketepatan waktu pengiriman",
    },
    {
      title: "Manajemen Pengiriman",
      desc: "Kelola proses pengiriman kargo secara efisien dari penerimaan hingga tujuan akhir",
    },
    {
      title: "Tracking Log Real-Time",
      desc: "Pantau setiap perubahan status kargo secara real-time dengan pencatatan waktu yang akurat",
    },
    {
      title: "Sistem Operasional Terpusat",
      desc: "Pantau seluruh aktivitas kargo dalam satu sistem terpusat yang terintegrasi",
    },
  ];

  return (
    <section id="Services" className="py-20 px-6 bg-gray-200 scroll-mt-40">
      <div className="max-w-6xl mx-auto text-center">

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold">
          Layanan Kami
        </h2>
        <div className="w-16 h-1 bg-orange-400 mx-auto mt-2 mb-10 rounded"></div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6 justify-center">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left"
            >
              <div className="w-10 h-10 bg-orange-400 text-white flex items-center justify-center rounded mb-4">
                📦
              </div>

              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}