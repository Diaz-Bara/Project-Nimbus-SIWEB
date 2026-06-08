"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import AwbNotFoundCard from "@/components/errors/AwbNotFoundCard";

export type ErrorVariant = "not-found" | "awb-not-found" | "forbidden" | "server";
export type ErrorLayout = "dashboard" | "public" | "auth";

type ErrorPageContentProps = {
  variant: ErrorVariant;
  layout?: ErrorLayout;
  title?: string;
  message?: string;
  detail?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  showBack?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  showAwbRetry?: boolean;
  awbRetryAction?: string;
};

const VARIANTS: Record<
  ErrorVariant,
  {
    code: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultTitle: string;
    defaultMessage: string;
    iconWrap: string;
    badge: string;
    accent: string;
  }
> = {
  "not-found": {
    code: "404",
    icon: PaperAirplaneIcon,
    defaultTitle: "404 Not Found",
    defaultMessage:
      "The page or tracking route you are looking for cannot be found on our radar.",
    iconWrap: "bg-blue-50 text-blue-700 ring-blue-100",
    badge: "bg-blue-900 text-white",
    accent: "bg-orange-400",
  },
  "awb-not-found": {
    code: "404",
    icon: MagnifyingGlassIcon,
    defaultTitle: "404 Not Found",
    defaultMessage:
      "The AWB or tracking route you are looking for cannot be found on our radar.",
    iconWrap: "bg-orange-50 text-orange-600 ring-orange-100",
    badge: "bg-orange-500 text-white",
    accent: "bg-blue-700",
  },
  forbidden: {
    code: "403",
    icon: NoSymbolIcon,
    defaultTitle: "Access Denied",
    defaultMessage:
      "Your account does not have permission to open this page. Contact an administrator if you need access.",
    iconWrap: "bg-red-50 text-red-600 ring-red-100",
    badge: "bg-red-600 text-white",
    accent: "bg-orange-400",
  },
  server: {
    code: "500",
    icon: ExclamationTriangleIcon,
    defaultTitle: "System Error",
    defaultMessage:
      "The service is temporarily unavailable. Our operations team has been notified. Please try again.",
    iconWrap: "bg-amber-50 text-amber-600 ring-amber-100",
    badge: "bg-amber-500 text-white",
    accent: "bg-blue-700",
  },
};

function AwbRetryForm({ action }: { action: string }) {
  return (
    <form action={action} method="get" className="mt-6 pt-6 border-t border-gray-100">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
        Try another AWB number
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          name="awb"
          placeholder="Enter AWB number"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          Track Again
        </button>
      </div>
    </form>
  );
}

function ErrorBody({
  variant,
  layout = "public",
  title,
  message,
  detail,
  primaryHref = "/",
  primaryLabel = "Back to Home",
  secondaryHref,
  secondaryLabel,
  showBack = true,
  onRetry,
  retryLabel = "Reload page",
  showAwbRetry = false,
  awbRetryAction = "/tracking",
}: ErrorPageContentProps) {
  const router = useRouter();
  const config = VARIANTS[variant];
  const Icon = config.icon;
  const isAuth = layout === "auth";
  const isDashboard = layout === "dashboard";
  const awbValue = detail?.startsWith("AWB:") ? detail.replace("AWB:", "").trim() : detail;

  if (variant === "awb-not-found" || variant === "not-found") {
    return (
      <>
        <AwbNotFoundCard
          awb={variant === "awb-not-found" ? awbValue : undefined}
          backHref={primaryHref}
          backLabel={primaryLabel}
        />
        {showAwbRetry && <AwbRetryForm action={awbRetryAction} />}
        {showBack && (
          <button
            type="button"
            onClick={() => router.back()}
            className={`mt-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors ${
              isAuth ? "mx-auto" : ""
            }`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go back to previous page
          </button>
        )}
      </>
    );
  }

  return (
    <>
      {!isAuth && (
        <div className="flex items-start justify-between gap-4 mb-5">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider ${config.badge}`}
          >
            {config.code}
          </span>
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-4 ${config.iconWrap}`}
          >
            <Icon className="h-7 w-7" />
          </div>
        </div>
      )}

      {isAuth && (
        <div className="flex justify-center mb-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ring-4 ${config.iconWrap}`}
          >
            <Icon className="h-8 w-8" />
          </div>
        </div>
      )}

      <div className={`w-12 h-1 rounded-full mb-4 ${config.accent} ${isAuth ? "mx-auto" : ""}`} />

      <h2
        className={`font-bold text-gray-900 mb-2 ${
          isAuth ? "text-center text-xl" : isDashboard ? "text-2xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {title || config.defaultTitle}
      </h2>

      <p
        className={`text-sm text-gray-500 leading-relaxed ${
          isAuth ? "text-center mb-6" : "mb-5 max-w-prose"
        }`}
      >
        {message || config.defaultMessage}
      </p>

      {detail && (
        <div
          className={`mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 ${
            isAuth ? "text-center" : ""
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Detail
          </p>
          <p className="text-sm font-semibold text-blue-900 break-all">{detail}</p>
        </div>
      )}

      <div
        className={`flex flex-col sm:flex-row gap-3 ${
          isAuth ? "items-stretch" : "items-center"
        }`}
      >
        <Link
          href={primaryHref}
          className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          {primaryLabel}
        </Link>

        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {secondaryLabel}
          </Link>
        )}

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            {retryLabel}
          </button>
        )}
      </div>

      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          className={`mt-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors ${
            isAuth ? "mx-auto" : ""
          }`}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Go back to previous page
        </button>
      )}

      {showAwbRetry && <AwbRetryForm action={awbRetryAction} />}
    </>
  );
}

export default function ErrorPageContent(props: ErrorPageContentProps) {
  const layout = props.layout ?? "public";

  if (layout === "dashboard") {
    return (
      <div className="fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl">
          <ErrorBody {...props} layout="dashboard" />
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4 max-w-3xl">
          <div className="bg-blue-900 text-white rounded-xl p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-blue-300 mb-2">
              Nimbus Support
            </p>
            <p className="text-sm text-blue-100 leading-relaxed">
              Need operational help? Contact the cargo team through the contact page or the
              tracking admin dashboard.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
            <Image src="/logo.png" alt="Nimbus" width={40} height={40} className="rounded-lg" />
            <div>
              <p className="text-sm font-bold text-blue-900">
                Nimbus <span className="text-orange-400">Cargo Express</span>
              </p>
              <p className="text-xs text-gray-400">Precision Logistics Network</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "auth") {
    return <ErrorBody {...props} layout="auth" />;
  }

  return (
    <section className="fade-in min-h-[calc(100vh-12rem)] pt-28 pb-16 px-6 bg-gradient-to-b from-gray-50 via-white to-blue-50/50">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Nimbus Cargo Express" width={56} height={56} priority />
        </div>
        <p className="text-center text-sm font-semibold text-gray-800 mb-1">
          Nimbus <span className="text-orange-400">Cargo Express</span>
        </p>
        <p className="text-center text-xs text-gray-400 mb-8 tracking-wide">
          PRECISION LOGISTICS
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
          <ErrorBody {...props} layout="public" />
        </div>
      </div>
    </section>
  );
}