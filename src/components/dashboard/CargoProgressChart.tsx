import { fetchShipmentStats } from "@/lib/actions";
import CargoProgressChartClient from "./CargoProgressChartClient";

export default async function CargoProgressChart() {
  const stats = await fetchShipmentStats();
  const other = Math.max(
    0,
    stats.total - stats.inTransit - stats.delivered - stats.canceled
  );

  const chartData = [
    { name: "In Transit", value: stats.inTransit, fill: "#3b82f6" },
    { name: "Delivered", value: stats.delivered, fill: "#22c55e" },
    { name: "Canceled", value: stats.canceled, fill: "#ef4444" },
    { name: "Other", value: other, fill: "#f59e0b" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-400 mb-3">CARGO STATUS OVERVIEW</p>
      <CargoProgressChartClient data={chartData} />
    </div>
  );
}