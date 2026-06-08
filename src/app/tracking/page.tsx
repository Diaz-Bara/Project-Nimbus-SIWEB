import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import TrackingForm from "@/components/tracking/TrackingForm";

export default function TrackingPage() {
  return (
    <div className="relative min-h-screen p-10">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </Link>

      <TrackingForm />
    </div>
  );
}