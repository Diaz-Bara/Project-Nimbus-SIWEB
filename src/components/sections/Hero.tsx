import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center text-white overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-blue-900/70"></div>

      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Nimbus <span className="text-orange-400">Cargo</span><br />
            <span className="text-orange-400">Express</span>
          </h1>

          <p className="mb-4 font-semibold text-gray-200">
            Fast, Secure, and Reliable Air Cargo Delivery
          </p>

          <p className="mb-6 text-gray-300 text-sm max-w-md">
            We deliver professional air cargo logistics with broad coverage across
            Indonesia and international routes.
          </p>

          <Link
            href="/tracking"
            className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-black px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Track Now
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="bg-white p-6 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">
            <Image
              src="/logo.png"
              alt="logo"
              width={220}
              height={220}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}