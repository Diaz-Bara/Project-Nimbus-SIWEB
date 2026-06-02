import { auth } from "@/auth"; // Mengambil sesi login dari NextAuth

export default async function Topbar() {
  // Mendapatkan data user yang sedang login secara server-side
  const session = await auth();
  const user = session?.user;

  return (
    <div className="w-full flex justify-end items-center">
      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* USER INFO (Tampilan dipertahankan sesuai kodemu) */}
        <div className="text-right text-sm">
          {/* Akan menampilkan email/username orang yang login */}
          <p className="font-semibold">{user?.email || "Guest"} 👤</p>
        </div>
      </div>
    </div>
  );
}