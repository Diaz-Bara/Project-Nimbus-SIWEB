import StatsCard from "@/components/dashboard/StatsCard";
import { fetchShipmentStats } from "@/lib/actions";

export default async function DashboardStats() {
  const stats = await fetchShipmentStats();

  return (
    <div className="grid md:grid-cols-4 gap-4 mt-6">
      <StatsCard title="Total Cargo" value={stats.total.toString()} sub="All registered shipments" />
      <StatsCard title="In Transit" value={stats.inTransit.toString()} sub="Currently shipping" />
      <StatsCard title="Delivered" value={stats.delivered.toString()} sub="Successfully arrived" icon="check" />
      <StatsCard title="Cancelled" value={stats.canceled.toString()} sub="Cancelled shipments" />
    </div>
  );
}
