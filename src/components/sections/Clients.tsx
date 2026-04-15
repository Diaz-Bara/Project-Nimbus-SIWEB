export default function Clients() {
  const clients = [
    "Garuda Indonesia",
    "JNE",
    "Shopee",
    "Tokopedia",
    "Lion Air",
  ];

  return (
    <section id="Clients" className="py-20 px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        
        <h2 className="text-2xl md:text-3xl font-bold mb-10">
          Klien & Mitra Kami
        </h2>

        <div className="w-16 h-1 bg-orange-400 mx-auto mt-2 mb-8 rounded"></div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {clients.map((client, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow text-sm font-semibold"
            >
              {client}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}