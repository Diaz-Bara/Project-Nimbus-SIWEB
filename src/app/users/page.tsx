"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

const users = [
  {
    id: 1,
    initials: "BS",
    name: "Boas Salosa",
    email: "boas.s@nimbus.cargo",
    empId: "ADM-99210",
    role: "ADMIN",
    terminal: "Global Access",
    lastLogin: "12 mins ago",
    status: "ACTIVE",
  },
  {
    id: 2,
    initials: "JI",
    name: "Jay Idzes",
    email: "jay.i@nimbus.cargo",
    empId: "ADM-88432",
    role: "ADMIN",
    terminal: "CGK-Main",
    lastLogin: "2 hours ago",
    status: "ACTIVE",
  },
  {
    id: 3,
    initials: "BP",
    name: "Bambang Pamungkas",
    email: "bambang.p@nimbus.cargo",
    empId: "OPR-77001",
    role: "OPERATOR",
    terminal: "DPS-Terminal",
    lastLogin: "3 days ago",
    status: "INACTIVE",
  },
  {
    id: 4,
    initials: "JH",
    name: "Justin Hubner",
    email: "justin.h@nimbus.cargo",
    empId: "OPR-88544",
    role: "OPERATOR",
    terminal: "KNO-Gateway",
    lastLogin: "5 mins ago",
    status: "ACTIVE",
  },
];

export default function UsersPage() {
  return (
    <div className="h-screen flex bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">

          {/* HEADER */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">

            <div className="bg-white p-5 rounded-xl shadow-sm md:col-span-2">
              <p className="text-xs text-gray-400 mb-1">
                SECURITY COMPLIANCE
              </p>
              <h2 className="text-xl font-bold text-blue-900">
                98.4% of Active Operators verified
              </h2>

              <div className="flex gap-2 mt-3 text-xs">
                <span className="bg-gray-100 px-3 py-1 rounded">
                  42 ACTIVE USERS
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded">
                  3 PENDING AUDITS
                </span>
              </div>
            </div>

            <div className="bg-blue-900 text-white p-5 rounded-xl shadow-sm">
              <p className="font-semibold mb-2">System Status</p>
              <p className="text-sm text-gray-200">
                All terminals online and synced.
              </p>

              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                REAL-TIME DATA STREAM ACTIVE
              </div>
            </div>

          </div>

          {/* TABLE CARD */}
          <div className="bg-white rounded-xl shadow-sm p-4">

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold">
                System Operators & Administrators
              </p>

              <div className="flex gap-3">
                <input
                  placeholder="Search by name or ID..."
                  className="border px-3 py-1 rounded-lg text-sm"
                />

                <button className="bg-blue-700 text-white px-4 py-1 rounded-lg text-sm">
                  + New User
                </button>
              </div>
            </div>

            {/* TABLE */}
            <table className="w-full text-sm">
              <thead className="text-gray-400 text-xs">
                <tr>
                  <th className="text-left">NAME</th>
                  <th>EMPLOYEE ID</th>
                  <th>ROLE</th>
                  <th>TERMINAL ACCESS</th>
                  <th>LAST LOGIN</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">

                    {/* NAME */}
                    <td className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                        {u.initials}
                      </div>

                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </td>

                    <td className="text-center">{u.empId}</td>

                    <td className="text-center">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {u.role}
                      </span>
                    </td>

                    <td className="text-center">{u.terminal}</td>
                    <td className="text-center">{u.lastLogin}</td>

                    <td className="text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          u.status === "ACTIVE"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="text-center">✏️</td>

                  </tr>
                ))}
              </tbody>
            </table>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
              <p>Showing users</p>

              <div className="flex gap-2">
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>Next</button>
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold mb-2">Recent Access Logs</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>Julian Sebastian — Logged in via Terminal A</li>
                <li>Anisa Rahmawati — Updated Shipment</li>
                <li>Maya Tan — Signed out</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold mb-2">Access Control Policy</p>
              <p className="text-sm text-gray-500">
                All operator actions are recorded and timestamped for regulatory compliance.
              </p>

              <div className="flex justify-between mt-4 text-sm font-semibold">
                <span>24/7 Monitoring</span>
                <span>AES Encryption</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}