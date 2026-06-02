import { cookies } from "next/headers";

export default async function Topbar() {
  const cookieStore = await cookies();
  const user = cookieStore.get("app_user")?.value || "Guest";
  const role = cookieStore.get("app_role")?.value || "guest";

  return (
    <div className="w-full flex justify-end items-center">
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <p className="font-semibold">{user}</p>
          <p className="text-xs uppercase text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}
