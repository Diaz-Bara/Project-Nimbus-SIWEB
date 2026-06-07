"use client";

import { useState, useEffect } from "react";

type User = {
  id?: number;
  initials?: string;
  name: string;
  email: string;
  empId: string;
  role: string;
  terminal: string;
  status: string;
};

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => Promise<void>;
  userData?: User | null;
  isSaving?: boolean;
  errorMessage?: string | null;
};

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  userData,
  isSaving = false,
  errorMessage,
}: UserModalProps) {
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    empId: "",
    role: "OPERATOR",
    terminal: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (userData) {
      setForm(userData);
    } else {
      setForm({
        name: "",
        email: "",
        empId: "",
        role: "OPERATOR",
        terminal: "",
        status: "ACTIVE",
      });
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-800">
            {userData ? "Update User" : "New User"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            aria-label="Close user modal"
          >
            x
          </button>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</label>
              <input
                required
                placeholder="Full Name"
                className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
              <input
                required
                type="email"
                placeholder="email@nimbus.cargo"
                className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Employee ID</label>
                <input
                  required
                  placeholder="e.g. ADM-99210"
                  className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm uppercase"
                  value={form.empId}
                  onChange={(e) => setForm({ ...form, empId: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Terminal Access</label>
                <input
                  required
                  placeholder="e.g. Global Access"
                  className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                  value={form.terminal}
                  onChange={(e) => setForm({ ...form, terminal: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</label>
                <select
                  required
                  className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm bg-white cursor-pointer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="OPERATOR">OPERATOR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                <select
                  required
                  className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm bg-white cursor-pointer"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={isSaving}
            className="px-6 py-2 bg-[#1a4bba] hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
