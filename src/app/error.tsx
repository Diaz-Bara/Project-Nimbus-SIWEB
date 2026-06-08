"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import ErrorPageContent from "@/components/errors/ErrorPageContent";
import NotFoundView from "@/components/errors/NotFoundView";
import { isNotFoundError } from "@/lib/error-classification";
import { getRouteContext } from "@/lib/route-context";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const context = getRouteContext(pathname);

  useEffect(() => {
    if (!isNotFoundError(error)) {
      console.error(error);
    }
  }, [error]);

  if (isNotFoundError(error)) {
    return <NotFoundView context={context} />;
  }

  const sharedProps = {
    variant: "server" as const,
    detail: error.digest ? `Reference: ${error.digest}` : undefined,
    onRetry: reset,
    showBack: false,
    secondaryHref: context === "dashboard" ? "/TrackingAdmin" : "/tracking",
    secondaryLabel: "Track Shipment",
  };

  if (context === "dashboard") {
    return (
      <DashboardShell>
        <ErrorPageContent
          layout="dashboard"
          {...sharedProps}
          primaryHref="/dashboard"
          primaryLabel="Back to Dashboard"
        />
      </DashboardShell>
    );
  }

  return (
    <ErrorPageContent
      layout="public"
      {...sharedProps}
      primaryHref="/"
      primaryLabel="Back to Home"
    />
  );
}