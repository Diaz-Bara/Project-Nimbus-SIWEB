// src/components/users/UserMetrics.tsx

export default async function UserMetrics() {
  // Simulasi waktu memuat data selama 1.5 detik
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl shadow-sm md:col-span-2">
        <p className="text-xs text-gray-400 mb-1">SECURITY COMPLIANCE</p>
        <h2 className="text-xl font-bold text-blue-900">
          98.4% of Active Operators verified
        </h2>
        <div className="flex gap-2 mt-3 text-xs">
          <span className="bg-gray-100 px-3 py-1 rounded">42 ACTIVE USERS</span>
          <span className="bg-gray-100 px-3 py-1 rounded">3 PENDING AUDITS</span>
        </div>
      </div>
      
      <div className="bg-blue-900 text-white p-5 rounded-xl shadow-sm">
        <p className="font-semibold mb-2">System Status</p>
        <p className="text-sm text-gray-200">All terminals online and synced.</p>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          REAL-TIME DATA STREAM ACTIVE
        </div>
      </div>
    </div>
  );
}