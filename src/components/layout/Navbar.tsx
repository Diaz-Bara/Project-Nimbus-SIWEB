import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white shadow-md">
      
      {/* KIRI: LOGO + NAMA */}
      <div className="flex items-center gap-3">
        <div className="bg-white p-1 rounded-xl shadow-md hover:shadow-lg transition">
          <Image
            src="/logo.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
        </div>

        <h1 className="font-bold text-lg">
          Nimbus Cargo
        </h1>
      </div>

       {/* TENGAH: MENU */}
      <div className="flex-1 flex justify-center space-x-6">
        <a href="#home" className="hover:text-blue-600">
          Beranda
        </a>
        <a href="#About" className="hover:text-blue-600">
          Tentang
        </a>
        <a href="#Services" className="hover:text-blue-600">
          Layanan
        </a>
        <a href="#Clients" className="hover:text-blue-600">
          Klien
        </a>
        <a href="#Contact" className="hover:text-blue-600">
          Kontak
        </a>
      </div>

      <div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          Login
        </button>
      </div>

    </nav>
  );
}

 