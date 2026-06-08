import DashboardShellServer from "@/components/layout/DashboardShellServer";
import ErrorPageContent from "@/components/errors/ErrorPageContent";

type ForbiddenPageProps = {
  searchParams?: Promise<{
    from?: string;
  }>;
};

export default async function ForbiddenPage(props: ForbiddenPageProps) {
  const searchParams = await props.searchParams;
  const from = searchParams?.from?.trim();

  return (
    <DashboardShellServer>
      <ErrorPageContent
        layout="dashboard"
        variant="forbidden"
        detail={from ? `Route: ${from}` : undefined}
        message="This page can only be accessed by Admin accounts. Use an account with the correct role or return to the dashboard."
        primaryHref="/dashboard"
        primaryLabel="Back to Dashboard"
        secondaryHref="/TrackingAdmin"
        secondaryLabel="AWB Tracking"
      />
    </DashboardShellServer>
  );
}