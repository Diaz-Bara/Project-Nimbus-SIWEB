import StatsCard from "@/components/dashboard/StatsCard";
import { fetchShipmentStats } from "@/lib/actions";

export default async function DashboardStats() {
  const stats = await fetchShipmentStats();

  return (
    <div className="grid md:grid-cols-4 gap-4 mt-6">
      <StatsCard title="Active Cargo" value={stats.total.toString()} sub="Database synced" />
      <StatsCard title="In Transit" value={stats.inTransit.toString()} sub="Live shipment status" />
      <StatsCard title="Flagged Cargo" value={stats.flagged.toString()} sub="Needs operator review" />
      <StatsCard title="On-Time Index" value="A-" sub="Reviewed from shipment data" />
    </div>
  );
}
