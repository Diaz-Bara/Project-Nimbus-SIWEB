import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nimbus <span className="text-orange-400">Cargo Express</span>
          </h1>
          <p className="mb-6 text-lg">
            Solusi logistik udara cepat, aman, dan terpercaya.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-xl">
            Tracking Sekarang
          </button>
        </div>

        <div className="flex justify-center">
          <Image src="/logo.png" alt="logo" width={300} height={300} className="rounded-2xl"/>
        </div>
      </div>
    </section>
  );
}

<section id="home" className="..."></section>