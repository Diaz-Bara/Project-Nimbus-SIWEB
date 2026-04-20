export default function Topbar() {
  return (
    <div className="flex justify-between items-center">

      <input
        placeholder="Search..."
        className="w-1/2 px-4 py-2 rounded-lg border"
      />

      <div className="text-sm">
        Ops. Chief<br />
        <span className="text-gray-400">ID: EPX-02</span>
      </div>

    </div>
  );
}