export default function StatsCard({ title, value, sub, icon }: { title: string; value: string; sub: string; icon?: string }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        {icon === "check" && (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
