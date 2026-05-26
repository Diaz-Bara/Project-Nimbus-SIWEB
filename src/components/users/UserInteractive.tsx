"use client";

import { useState, useEffect, ReactNode } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import UserModal from "./UserModal";

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

export default function UserInteractive({
  initialData,
  searchComponent,
  paginationComponent,
}: {
  initialData: User[];
  searchComponent: ReactNode;
  paginationComponent: ReactNode;
}) {
  const [data, setData] = useState<User[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Perbarui data lokal jika prop initialData berubah (karena pencarian server)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (userData: any) => {
    if (selectedUser) {
      setData(data.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u)));
    } else {
      // Bikin inisial otomatis
      const inits = userData.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
      setData([{ ...userData, id: Date.now(), initials: inits, lastLogin: "Just now" }, ...data]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* HEADER: Judul, Search, Tombol New User */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <p className="font-semibold text-gray-800 text-lg">System Operators & Administrators</p>

        <div className="flex w-full md:w-auto gap-3 items-center">
          <div className="w-full md:w-64">
            {/* Tempat untuk komponen SearchWrapper */}
            {searchComponent}
          </div>
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="bg-[#1a4bba] text-white px-4 py-[9px] rounded-md text-sm flex-shrink-0 hover:bg-blue-800 transition"
          >
            + New User
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm mt-2">
        <thead className="text-gray-400 text-xs">
          <tr>
            <th className="text-left pb-3 uppercase">Name</th>
            <th className="pb-3 uppercase">Employee ID</th>
            <th className="pb-3 uppercase">Role</th>
            <th className="pb-3 uppercase">Terminal Access</th>
            <th className="pb-3 uppercase">Last Login</th>
            <th className="pb-3 uppercase">Status</th>
            <th className="pb-3 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500 italic">User tidak ditemukan.</td>
            </tr>
          ) : (
            data.map((u) => (
              <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition">
                <td className="flex items-center gap-3 py-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {u.initials}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </td>
                <td className="text-center text-gray-600">{u.empId}</td>
                <td className="text-center">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[11px] font-medium">{u.role}</span>
                </td>
                <td className="text-center text-gray-600">{u.terminal}</td>
                <td className="text-center text-gray-600">{u.lastLogin}</td>
                <td className="text-center">
                  <span className={`px-2 py-1 rounded text-[11px] font-medium ${u.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => handleEdit(u)}
                    className="text-orange-500 hover:text-orange-600 transition p-1"
                    title="Edit User"
                  >
                    <PencilIcon className="w-[18px] h-[18px]" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* FOOTER: Pagination */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
        <p>Showing users</p>
        <div className="scale-90">
          {paginationComponent}
        </div>
      </div>

      {/* MODAL POP-UP */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
        userData={selectedUser}
      />
    </div>
  );
}