type User = {
  id: number;
  initials: string;
  name: string;
  email: string;
  empId: string;
  role: string;
  terminal: string;
  lastLogin: string;
  status: string;
};

export default async function UserList({ query, currentPage }: { query: string; currentPage: number }) {
  // Simulasi delay agar Skeleton Loading terlihat elegan
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Data asli dari kodinganmu
  const users: User[] = [
    { id: 1, initials: "BS", name: "Boas Salosa", email: "boas.s@nimbus.cargo", empId: "ADM-99210", role: "ADMIN", terminal: "Global Access", lastLogin: "12 mins ago", status: "ACTIVE" },
    { id: 2, initials: "JI", name: "Jay Idzes", email: "jay.i@nimbus.cargo", empId: "ADM-88432", role: "ADMIN", terminal: "CGK-Main", lastLogin: "2 hours ago", status: "ACTIVE" },
    { id: 3, initials: "BP", name: "Bambang Pamungkas", email: "bambang.p@nimbus.cargo", empId: "OPR-77001", role: "OPERATOR", terminal: "DPS-Terminal", lastLogin: "3 days ago", status: "INACTIVE" },
    { id: 4, initials: "JH", name: "Justin Hubner", email: "justin.h@nimbus.cargo", empId: "OPR-88544", role: "OPERATOR", terminal: "KNO-Gateway", lastLogin: "5 mins ago", status: "ACTIVE" },
  ];

  // Logika Filter: Bisa mencari berdasarkan Nama atau Employee ID
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.empId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <table className="w-full text-sm">
      <thead className="text-gray-400 text-xs">
        <tr>
          <th className="text-left pb-3">NAME</th>
          <th className="pb-3">EMPLOYEE ID</th>
          <th className="pb-3">ROLE</th>
          <th className="pb-3">TERMINAL ACCESS</th>
          <th className="pb-3">LAST LOGIN</th>
          <th className="pb-3">STATUS</th>
          <th className="pb-3">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-6 text-gray-500 italic">User tidak ditemukan.</td>
          </tr>
        ) : (
          filteredUsers.map((u) => (
            <tr key={u.id} className="border-t">
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
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{u.role}</span>
              </td>
              <td className="text-center">{u.terminal}</td>
              <td className="text-center">{u.lastLogin}</td>
              <td className="text-center">
                <span className={`px-2 py-1 rounded text-xs ${u.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}>
                  {u.status}
                </span>
              </td>
              <td className="text-center cursor-pointer hover:opacity-70 transition">✏️</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}