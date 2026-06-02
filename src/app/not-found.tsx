"use client";

import { useRouter } from "next/navigation";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
        
        {/* Ikon Pesawat Disilang (Custom dengan Tailwind) */}
        <div className="relative w-16 h-16 mx-auto mb-4 text-gray-400">
          <PaperAirplaneIcon className="w-full h-full" />
          {/* Garis merah melintang (Slash) */}
          <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
            <div className="w-[120%] h-1.5 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">404 Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Halaman atau rute penerbangan yang kamu cari tidak dapat ditemukan di radar kami.
        </p>
        
        <button
          onClick={() => router.back()}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors w-full"
        >
          Kembali
        </button>
      </div>
    </main>
  );
}