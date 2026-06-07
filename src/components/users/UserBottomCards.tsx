import { fetchRecentAccessLogs } from "@/lib/actions";

export default async function UserBottomCards() {
  const logs = await fetchRecentAccessLogs(3);

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="font-semibold mb-2">Recent Access Logs</p>
        <ul className="text-sm text-gray-500 space-y-1">
          {logs.length === 0 ? (
            <li>No access logs available.</li>
          ) : (
            logs.map((log) => (
              <li key={`${log.name}-${log.lastLogin}`}>
                {log.name} - Logged in via {log.terminal} ({log.lastLogin})
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="font-semibold mb-2">Access Control Policy</p>
        <p className="text-sm text-gray-500">
          All operator actions are recorded and timestamped for regulatory compliance.
        </p>
        <div className="flex justify-between mt-4 text-sm font-semibold">
          <span>24/7 Monitoring</span>
          <span>AES Encryption</span>
        </div>
      </div>
    </div>
  );
}
