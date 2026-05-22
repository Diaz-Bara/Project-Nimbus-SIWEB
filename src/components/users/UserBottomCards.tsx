export default async function UserBottomCards() {
  // Efek delay 1.5 detik
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="font-semibold mb-2">Recent Access Logs</p>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>Julian Sebastian — Logged in via Terminal A</li>
          <li>Anisa Rahmawati — Updated Shipment</li>
          <li>Maya Tan — Signed out</li>
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