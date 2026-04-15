export default function Contact() {
  return (
    <section id="Contact" className="py-20 px-6 bg-white scroll-mt-40">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        
        {/* Info */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Hubungi Kami
          </h2>

          <div className="w-16 h-1 bg-orange-400 mt-2 mb-6 rounded"></div>

          <div className="space-y-4">

            {/* CARD */}
            <div className="bg-gray-100 p-4 rounded-xl flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-orange-400 text-white flex items-center justify-center rounded-lg shadow">
                📍
              </div>
              <div>
                <h3 className="font-semibold">Alamat</h3>
                <p className="text-sm text-gray-600">Yogyakarta, Indonesia</p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-orange-400 text-white flex items-center justify-center rounded-lg shadow">
                📞
              </div>
              <div>
                <h3 className="font-semibold">Telepon</h3>
                <p className="text-sm text-gray-600">+62 812 3456 7890</p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-orange-400 text-white flex items-center justify-center rounded-lg shadow">
                ✉️
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-gray-600">info@nimbuscargo.com</p>
              </div>
            </div>

          </div>
        </div> {/* ✅ INI YANG TADI KURANG */}

        {/* Map */}
        <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-md">
          <iframe
            src="https://maps.google.com/maps?q=yogyakarta&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </section>
  );
}