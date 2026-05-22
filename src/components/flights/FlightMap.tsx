export default async function FlightMap() {
  // Efek delay 1.5 detik
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm h-64 flex items-center justify-center text-gray-400">
      🌍 Live Global Network (Map Placeholder)
    </div>
  );
}