import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back",
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Link
        href={backHref}
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="Nimbus Cargo Express"
            width={72}
            height={72}
            className="mb-3"
            priority
          />
          <p className="text-sm font-semibold text-gray-800">
            Nimbus <span className="text-orange-400">Cargo Express</span>
          </p>
        </div>

        <h1 className="text-center text-xl font-bold text-gray-800 mb-1">{title}</h1>
        <p className="text-center text-xs text-gray-400 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}