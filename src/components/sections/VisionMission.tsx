export default function VisionMission() {
  return (
    <section className="py-20 px-6 bg-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Vision & Mission
        </h2>

        <div className="w-16 h-1 bg-orange-400 mx-auto mt-2 mb-8 rounded"></div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Vision
            </h3>
            <p className="text-gray-600">
              To become a leading air freight company that delivers fast, secure,
              and reliable services at both national and international levels.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Mission
            </h3>
            <ul className="text-gray-600 list-disc pl-5 space-y-2">
              <li>Provide fast and efficient delivery services</li>
              <li>Ensure cargo safety and quality</li>
              <li>Develop modern tracking technology</li>
              <li>Improve customer satisfaction</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}