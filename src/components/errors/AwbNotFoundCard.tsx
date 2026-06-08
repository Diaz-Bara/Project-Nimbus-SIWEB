"use client";

import Link from "next/link";
import { NoSymbolIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

type AwbNotFoundCardProps = {
  awb?: string;
  backHref: string;
  backLabel?: string;
  className?: string;
};

export default function AwbNotFoundCard({
  awb,
  backHref,
  backLabel = "Back",
  className = "",
}: AwbNotFoundCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10 text-center ${className}`}
    >
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <PaperAirplaneIcon className="h-9 w-9 -rotate-12" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 ring-4 ring-white">
          <NoSymbolIcon className="h-5 w-5" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">404 Not Found</h2>

      <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-2">
        The AWB or tracking route you are looking for cannot be found on our radar.
      </p>

      {awb && (
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
          AWB: <span className="text-blue-900 normal-case tracking-normal">{awb}</span>
        </p>
      )}

      <Link
        href={backHref}
        className="inline-flex w-full max-w-xs items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        {backLabel}
      </Link>
    </div>
  );
}