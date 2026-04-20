export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="font-bold text-lg mb-2">
            Nimbus <span className="text-orange-400">Cargo Express</span>
          </h2>
          <p className="text-sm text-gray-300">
            ⚡Solusi pengiriman kargo udara cepat, aman, dan terpercaya di seluruh Indonesia. ⚡
          </p>
        </div>

        {/* KONTAK */}
        <div>
          <h3 className="font-semibold mb-3">Kontak Cepat</h3>
          <p className="text-sm text-gray-300">☎️ contact@nimbuscargo.com</p>
          <p className="text-sm text-gray-300">📞 +62 21 5555 1234</p>
          <p className="text-sm text-gray-300">📍 Yogyakarta, Indonesia</p>
        </div>


      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
        © 2026 Nimbus Cargo Express — All rights reserved.
      </div>
    </footer>
  );
}