export function FlightCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        {/* Placeholder untuk Kode Pesawat & Status */}
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        {/* Placeholder untuk Bandara Asal */}
        <div className="flex flex-col space-y-2">
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Placeholder untuk Garis Rute di Tengah */}
        <div className="flex-1 px-6 flex items-center justify-center">
          <div className="h-0.5 w-full bg-gray-200 animate-pulse relative">
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>
        
        {/* Placeholder untuk Bandara Tujuan */}
        <div className="flex flex-col space-y-2 text-right items-end">
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Placeholder untuk Progress Bar */}
      <div className="mt-5 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gray-200 w-1/3 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

export default function FlightsListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Menampilkan 4 skeleton sekaligus agar terlihat seperti list penuh */}
      <FlightCardSkeleton />
      <FlightCardSkeleton />
      <FlightCardSkeleton />
      <FlightCardSkeleton />
    </div>
  );
}