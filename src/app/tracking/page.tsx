import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import TrackingForm from "@/components/tracking/TrackingForm";

function TrackingFormFallback() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-3 w-40 bg-gray-200 rounded" />
      <div className="h-11 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function TrackingPage() {
  return (
    <section className="relative fade-in min-h-screen pt-20 pb-16 px-6 bg-gradient-to-b from-gray-50 via-white to-blue-50/50">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors z-10"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Nimbus Cargo Express"
            width={56}
            height={56}
            className="mx-auto mb-3"
            priority
          />
          <p className="text-sm font-semibold text-gray-800">
            Nimbus <span className="text-orange-400">Cargo Express</span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-4 mb-2">
            Shipment Tracking
          </h1>
          <div className="w-12 h-1 bg-orange-400 mx-auto rounded mb-3" />
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Track your air cargo status in real time using your AWB number.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
          <Suspense fallback={<TrackingFormFallback />}>
            <TrackingForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}