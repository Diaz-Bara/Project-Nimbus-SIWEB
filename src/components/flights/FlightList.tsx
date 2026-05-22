import FlightCard from "@/components/flights/FlightCard";

export default async function FlightList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // Simulasi loading/delay selama 1.5 detik agar efek Suspense terlihat
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Data penerbangan dari kodemu
  const flights = [
    {
      id: 1,
      code: "PT-882",
      aircraft: "Boeing 777-F",
      from: "CGK",
      fromCity: "Jakarta",
      timeFrom: "08:45 AM",
      to: "SIN",
      toCity: "Singapore",
      timeTo: "10:30 AM",
      status: "active",
      progress: 65,
    },
    {
      id: 2,
      code: "PT-914",
      aircraft: "Airbus A330-200F",
      from: "SIN",
      fromCity: "Singapore",
      timeFrom: "11:15 AM",
      to: "HKG",
      toCity: "Hong Kong",
      timeTo: "03:45 PM",
      status: "delay",
      progress: 20,
    },
    {
      id: 3,
      code: "PT-115",
      aircraft: "Boeing 747-8F",
      from: "CGK",
      fromCity: "Jakarta",
      timeFrom: "01:00 PM",
      to: "NRT",
      toCity: "Tokyo",
      timeTo: "09:15 PM",
      status: "scheduled",
      progress: 0,
    },
    {
      id: 4,
      code: "PT-552",
      aircraft: "Airbus A350-F",
      from: "HKG",
      fromCity: "Hong Kong",
      timeFrom: "04:20 PM",
      to: "LHR",
      toCity: "London",
      timeTo: "05:10 AM",
      status: "active",
      progress: 25,
    },
  ];

  // Logika filter sederhana agar search bar-nya langsung berfungsi secara visual
  const filteredFlights = flights.filter((flight) =>
    flight.code.toLowerCase().includes(query.toLowerCase()) ||
    flight.toCity.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredFlights.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada penerbangan yang cocok.</p>
      ) : (
        filteredFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))
      )}
    </div>
  );
}