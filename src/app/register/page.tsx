import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">

        <h2 className="font-semibold text-gray-700 mb-4">
          Add New Account
        </h2>

        {/* INPUTS */}
        <div className="space-y-3">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Employee ID"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <select className="w-full border rounded-lg px-3 py-2 text-sm">
            <option>Select role</option>
            <option>Admin</option>
            <option>Operator</option>
          </select>

          <select className="w-full border rounded-lg px-3 py-2 text-sm">
            <option>Terminal Access</option>
            <option>Jakarta</option>
            <option>Surabaya</option>
          </select>

          <div className="flex justify-between items-center text-sm">
            <span>Status</span>
            <input type="checkbox" />
          </div>

        </div>

        {/* BUTTON */}
        <div className="flex justify-end gap-2 mt-6">
          <Link href="/login">
            <button className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
          </Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Create User
          </button>
        </div>

      </div>
    </div>
  );
}