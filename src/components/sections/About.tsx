import Image from "next/image";

export default function About() {
  return (
    <section id="About" className="py-20 px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          About the Company
        </h2>

        <div className="w-16 h-1 bg-orange-400 mx-auto mt-2 mb-8 rounded"></div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Image
              src="/image/aircraft/plane.jpg"
              alt="Cargo aircraft"
              width={400}
              height={300}
              className="rounded-lg shadow-flex hover:scale-105 transition duration-300"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">
              Nimbus <span className="text-orange-500">Cargo Express</span>
            </h3>

            <p className="text-gray-600 mb-4">
              Nimbus Cargo Express is a leading air cargo logistics company in
              Indonesia, specializing in fast, secure, and reliable delivery
              services.
            </p>

            <p className="text-gray-600">
              With an extensive network and modern technology, we are committed
              to providing the best logistics solutions for your business needs
              across Indonesia and internationally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}