import StatsCard from "@/components/dashboard/StatsCard";

export default async function DashboardStats() {
  // Simulasi waktu memuat data selama 1 detik
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="grid md:grid-cols-4 gap-4 mt-6">
      <StatsCard title="Active Cargo" value="1,284" sub="⤴️+12% vs Yesterday" />
      <StatsCard title="Fleet Efficiency" value="98.2%" sub="💿Optimal Range" />
      <StatsCard title="Current Delay" value="14m" sub="At CGK Terminal" />
      <StatsCard title="On-Time Index" value="A-" sub="Reviewed 2m ago" />
    </div>
  );
}