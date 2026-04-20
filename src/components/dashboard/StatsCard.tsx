export default function StatsCard({ title, value, sub }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}