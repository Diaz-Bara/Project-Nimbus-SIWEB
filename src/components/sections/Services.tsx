import {
  BoltIcon,
  ClipboardDocumentCheckIcon,
  ComputerDesktopIcon,
  CubeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function Services() {
  const services = [
    {
      title: "Cargo Tracking",
      desc: "Monitor your shipment status in real time through an integrated tracking system",
      icon: CubeIcon,
    },
    {
      title: "Flight Monitoring",
      desc: "Track cargo flight status in real time to ensure on-time delivery",
      icon: PaperAirplaneIcon,
    },
    {
      title: "Shipment Management",
      desc: "Manage cargo shipments efficiently from pickup through final delivery",
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: "Real-Time Tracking Logs",
      desc: "Monitor every cargo status change in real time with accurate timestamps",
      icon: BoltIcon,
    },
    {
      title: "Centralized Operations System",
      desc: "Monitor all cargo activity in one integrated centralized system",
      icon: ComputerDesktopIcon,
    },
  ];

  return (
    <section id="Services" className="py-20 bg-gray-200 scroll-mt-40">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold">Our Services</h2>
        <div className="w-12 h-1 bg-orange-400 mx-auto mt-2 mb-12 rounded"></div>

        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            {services.slice(0, 3).map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition text-left"
                >
                  <div className="w-10 h-10 bg-orange-400 text-white flex items-center justify-center rounded-lg mb-4 shadow">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-8 flex-wrap">
            {services.slice(3).map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition text-left w-[300px]"
                >
                  <div className="w-10 h-10 bg-orange-400 text-white flex items-center justify-center rounded-lg mb-4 shadow">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}