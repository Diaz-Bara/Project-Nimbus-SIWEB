import { redirect } from "next/navigation";

type TrackingNotFoundPageProps = {
  searchParams?: Promise<{
    awb?: string;
  }>;
};

export default async function TrackingNotFoundPage(props: TrackingNotFoundPageProps) {
  const searchParams = await props.searchParams;
  const awb = searchParams?.awb?.trim();

  if (awb) {
    redirect(`/tracking?awb=${encodeURIComponent(awb)}`);
  }

  redirect("/tracking");
}