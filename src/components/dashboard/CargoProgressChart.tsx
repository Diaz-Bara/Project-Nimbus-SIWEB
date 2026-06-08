import { fetchShipmentStats } from "@/lib/actions";
import CargoProgressChartClient from "./CargoProgressChartClient";

export default async function CargoProgressChart() {
  const stats = await fetchShipmentStats();
  const other = Math.max(
    0,
    stats.total - stats.inTransit - stats.delivered - stats.canceled,
  );

  const chartData = [
    { name: "In Transit", value: stats.inTransit, fill: "#3b82f6" },
    { name: "Delivered", value: stats.delivered, fill: "#22c55e" },
    { name: "Canceled", value: stats.canceled, fill: "#ef4444" },
    { name: "Other", value: other, fill: "#f59e0b" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-1">Cargo Progress</h3>
      <p className="text-xs text-gray-400 mb-5">Distribution by shipment status</p>
      <CargoProgressChartClient data={chartData} />
    </div>
  );
}