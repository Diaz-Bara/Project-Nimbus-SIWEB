import { redirect } from "next/navigation";

type TrackingAdminNotFoundPageProps = {
  searchParams?: Promise<{
    awb?: string;
  }>;
};

export default async function TrackingAdminNotFoundPage(
  props: TrackingAdminNotFoundPageProps,
) {
  const searchParams = await props.searchParams;
  const awb = searchParams?.awb?.trim();

  if (awb) {
    redirect(`/TrackingAdmin?awb=${encodeURIComponent(awb)}`);
  }

  redirect("/TrackingAdmin");
}