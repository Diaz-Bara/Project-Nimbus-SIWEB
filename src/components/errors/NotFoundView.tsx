"use client";

import AuthShell from "@/components/auth/AuthShell";
import DashboardShell from "@/components/layout/DashboardShell";
import ErrorPageContent from "@/components/errors/ErrorPageContent";
import type { AppRouteContext } from "@/lib/route-context";

type NotFoundViewProps = {
  context: AppRouteContext;
};

export default function NotFoundView({ context }: NotFoundViewProps) {
  if (context === "dashboard") {
    return (
      <DashboardShell>
        <ErrorPageContent
          layout="dashboard"
          variant="not-found"
          primaryHref="/dashboard"
          primaryLabel="Back to Dashboard"
          secondaryHref="/TrackingAdmin"
          secondaryLabel="AWB Tracking"
        />
      </DashboardShell>
    );
  }

  if (context === "auth") {
    return (
      <AuthShell
        title="Page Not Found"
        subtitle="The login or registration route you opened is not valid"
        backHref="/login"
        backLabel="Back to Login"
      >
        <ErrorPageContent
          layout="auth"
          variant="not-found"
          primaryHref="/login"
          primaryLabel="Back to Login"
          secondaryHref="/"
          secondaryLabel="Home"
          showBack={false}
        />
      </AuthShell>
    );
  }

  return (
    <ErrorPageContent
      layout="public"
      variant="not-found"
      primaryHref="/"
      primaryLabel="Back"
      secondaryHref="/tracking"
      secondaryLabel="Track Shipment"
    />
  );
}