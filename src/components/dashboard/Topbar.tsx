export default function Topbar() {
  return (
    <div className="flex justify-between items-center">

      <input
        placeholder="Search..."
        className="w-5/6 px-4 py-2 rounded-lg border"
      />

      <div className="text-sm">
        Admin 👤<br />
        <span className="text-gray-400">ID: ADM-01</span>
      </div>

    </div>
  );
}