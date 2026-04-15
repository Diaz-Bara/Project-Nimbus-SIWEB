export default function Contact() {
  return (
    <section id="Contact" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* Info */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Hubungi Kami
          </h2>

          <div className="w-16 h-1 bg-orange-400 mt-2 mb-6 rounded"></div>

          <p className="mb-4 text-gray-600">
            📍 Yogyakarta, Indonesia
          </p>
          <p className="mb-4 text-gray-600">
            📞 +62 812 3456 7890
          </p>
          <p className="mb-4 text-gray-600">
            ✉️ info@nimbuscargo.com
          </p>
        </div>

        {/* Map */}
        <div className="w-full h-[300px] rounded-xl overflow-hidden">
          <iframe
            src="https://maps.google.com/maps?q=yogyakarta&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </section>
  );
}

<section id="kontak" className="..."></section>