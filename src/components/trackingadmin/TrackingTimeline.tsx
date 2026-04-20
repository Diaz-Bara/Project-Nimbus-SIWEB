export default function TrackingTimeline() {
  const steps = [
    {
      title: "Received",
      desc: "Cargo received at Soekarno-Hatta (CGK) Hub",
      time: "Oct 12",
    },
    {
      title: "Sortation",
      desc: "Processed through automated precision sorter",
      time: "Oct 12",
    },
    {
      title: "Loaded to Aircraft",
      desc: "Manifested on Flight PT-882",
      time: "Today",
      active: true,
    },
    {
      title: "Departed",
      desc: "Estimated takeoff from runway",
      time: "Pending",
    },
    {
      title: "Arrived",
      desc: "Final destination arrival",
      time: "Scheduled",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">

      <p className="text-xs text-gray-400 mb-4">
        JOURNEY STATUS
      </p>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">

            {/* DOT */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  step.active ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              {i !== steps.length - 1 && (
                <div className="w-[2px] h-10 bg-gray-200" />
              )}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {step.title}
              </p>
              <p className="text-xs text-gray-500">
                {step.desc}
              </p>
            </div>

            <p className="text-xs text-gray-400">
              {step.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}