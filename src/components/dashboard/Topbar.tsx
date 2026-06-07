import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Topbar() {
  const session = await getSession();
  const user = session?.name || "Guest";
  const role = session?.role || "guest";

  return (
    <div className="w-full flex justify-end items-center">
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <p className="font-semibold">{user}</p>
          <p className="text-xs uppercase text-gray-400">{role}</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
