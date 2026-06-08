"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopbarClient from "@/components/dashboard/TopbarClient";

type DashboardShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export default function DashboardShell({
  children,
  title,
  subtitle,
}: DashboardShellProps) {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 shrink-0">
          <TopbarClient />
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {title && (
            <div className="mb-6">
              <h1 className="text-xl font-bold text-blue-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}