import Image from "next/image";

export default function About() {
  return (
    <section id="About" className="py-20 px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-10">
          Tentang Perusahaan
        </h2>

        <div className="w-16 h-1 bg-orange-400 mx-auto mt-2 mb-8 rounded"></div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* KIRI: GAMBAR */}
          <div>
            <Image
              src="/image/aircraft/plane.jpg"
              alt="Pesawat Kargo"
              width={400}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>

          {/* KANAN: TEXT */}
          <div>
            <h3 className="text-xl font-bold mb-3">
              Nimbus <span className="text-orange-500">Cargo Express</span>
            </h3>

            <p className="text-gray-600 mb-4">
              Nimbus Cargo Express adalah perusahaan logistik kargo udara
              terkemuka di Indonesia yang mengkhususkan diri dalam layanan
              pengiriman cepat, aman, dan terpercaya.
            </p>

            <p className="text-gray-600">
              Dengan jaringan luas dan teknologi terkini, kami berkomitmen
              memberikan solusi logistik terbaik untuk kebutuhan bisnis Anda
              di seluruh nusantara dan internasional.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}