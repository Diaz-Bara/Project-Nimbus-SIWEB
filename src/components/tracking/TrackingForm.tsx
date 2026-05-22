"use client";
import { useState, useEffect } from "react";
// (Jika kamu memisahkan TrackingResult, kamu bisa memanggilnya di bawah,
// tapi di sini saya gabungkan logikanya agar efek loading-nya seragam)

export default function TrackingForm() {
  const [awb, setAwb] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  // State untuk efek loading saat halaman pertama kali dibuka
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // State untuk efek loading (spinner) saat tombol "Track" ditekan
  const [isSearching, setIsSearching] = useState(false);

  // Menahan tampilan form asli selama 1.5 detik saat awal render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fungsi yang dijalankan saat tombol Track ditekan
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman refresh
    if (!awb) return; // Jangan mencari jika input kosong

    setIsSearching(true); // Munculkan spinner di tombol
    setStatus(null); // Sembunyikan status sebelumnya (jika ada)

    // Simulasi jeda waktu mencari data di server selama 1.5 detik
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Menampilkan hasil pencarian statis sesuai screenshot-mu
    setStatus("Paket sedang dalam perjalanan (Departed)");
    setIsSearching(false); // Matikan spinner
  };

  return (
    <div className="flex flex-col items-center mt-10">
      
      {/* LOGIKA LOADING AWAL HALAMAN */}
      {isPageLoading ? (
        // EFEK SKELETON (Tampil 1.5 detik pertama)
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse w-full max-w-lg">
          <div className="h-7 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="flex gap-2 w-full">
            <div className="h-11 flex-1 bg-gray-200 rounded-lg border border-blue-200"></div>
            <div className="h-11 w-24 bg-blue-300 rounded-lg"></div>
          </div>
        </div>
      ) : (
        // FORM ASLI (Tampil setelah loading selesai)
        <>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Tracking Pengiriman
          </h2>
          
          <form onSubmit={handleTrack} className="flex gap-2 w-full max-w-lg mb-4">
            <input
              type="text"
              placeholder="Masukkan nomor AWB"
              className="flex-1 border border-blue-500 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center min-w-[90px] disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isSearching ? (
                // SVG Spinner saat tombol diklik
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Track"
              )}
            </button>
          </form>

          {/* Area Hasil Tracking (Hanya muncul jika status ada isinya dan tidak sedang loading) */}
          {status && !isSearching && (
            <p className="text-green-600 font-semibold mt-2 text-sm">
              {status}
            </p>
          )}
        </>
      )}

    </div>
  );
}