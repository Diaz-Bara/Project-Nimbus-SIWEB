"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { NoSymbolIcon, PaperAirplaneIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Komponen Inti: Tampilan Premium 404 yang Anda sukai
function NotFoundContent() {
  const router = useRouter();

  return (
    <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-10 sm:p-14 text-center relative overflow-hidden animate-in fade-in zoom-in duration-300">
      
      {/* Dekorasi Garis Atas */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-900 via-blue-600 to-orange-400" />

      <Image
        src="/logo.png"
        alt="Nimbus Cargo Express"
        width={56}
        height={56}
        className="mx-auto mb-8 opacity-90 drop-shadow-sm"
        priority
      />

      {/* Ikon 404 Kustom */}
      <div className="relative mx-auto mb-10 flex h-32 w-32 items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-50/50 text-blue-200 shadow-inner">
          <PaperAirplaneIcon className="h-14 w-14 -rotate-12" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-4 ring-white shadow-md">
          <NoSymbolIcon className="h-7 w-7 stroke-[2.5]" />
        </div>
      </div>

      <h1 className="text-5xl font-extrabold text-blue-900 mb-3 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>

      <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-sm mx-auto">
        Oops! The route or page you are trying to access has gone off the radar or doesn't exist in our system.
      </p>

      <button
        onClick={() => router.back()}
        type="button"
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100"
      >
        <ArrowLeftIcon className="w-4 h-4 stroke-[2.5]" />
        Go Back to Previous Page
      </button>
    </div>
  );
}

// Logika Pendeteksi Rute & Penghilang Layout
function NotFoundLogic() {
  const pathname = usePathname();

  // Efek Samping: Mematikan paksa Navbar dan Footer Publik jika dirender oleh ClientLayoutWrapper
  useEffect(() => {
    // Sembunyikan elemen <nav> (Navbar) dan <footer> yang berada di luar jangkauan komponen ini
    const navbars = document.querySelectorAll('nav');
    const footers = document.querySelectorAll('footer');
    
    navbars.forEach(nav => nav.style.display = 'none');
    footers.forEach(footer => footer.style.display = 'none');

    // Kembalikan seperti semula ketika komponen 404 ini dilepaskan (unmount)
    return () => {
      navbars.forEach(nav => nav.style.display = '');
      footers.forEach(footer => footer.style.display = '');
    };
  }, []);

  // Deteksi apakah user tersesat di dalam rute admin/dashboard
  const isAdminRoute = [
    "/dashboard",
    "/users",
    "/shipments",
    "/flights",
    "/TrackingAdmin",
    "/query"
  ].some((route) => pathname?.startsWith(route));

  if (isAdminRoute) {
    // MODE ADMIN: Gunakan overlay fixed z-[9999] agar Sidebar dan Topbar Admin TERTUTUP PENUH
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-gray-50 via-white to-blue-50/50 flex flex-col items-center justify-center px-6 py-24 overflow-y-auto selection:bg-orange-100 selection:text-orange-900">
        <NotFoundContent />
        <div className="mt-8 text-sm font-medium text-gray-400">
          Nimbus <span className="text-orange-400/80">Cargo Express</span> System
        </div>
      </div>
    );
  }

  // MODE PUBLIK: Tampilan Biasa
  // (Navbar publik otomatis disembunyikan oleh useEffect di atas)
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-gray-50 via-white to-blue-50/50 flex flex-col items-center justify-center px-6 py-24 overflow-y-auto selection:bg-orange-100 selection:text-orange-900">
      <NotFoundContent />
      <div className="mt-8 text-sm font-medium text-gray-400">
        Nimbus <span className="text-orange-400/80">Cargo Express</span> System
      </div>
    </div>
  );
}

// Ekspor Utama yang Aman untuk Next.js App Router (Dibungkus Suspense)
export default function NotFound() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center animate-pulse">
          <p className="text-gray-400 font-medium">Loading layout...</p>
        </div>
      }
    >
      <NotFoundLogic />
    </Suspense>
  );
}