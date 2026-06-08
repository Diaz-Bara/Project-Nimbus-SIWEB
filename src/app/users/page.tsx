// src/app/users/page.tsx
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import UserList from "@/components/users/UserList";
import UserTableSkeleton from "@/components/users/UserSkeleton";
import UserMetrics from "@/components/users/UserMetrics";
import UserBottomCards from "@/components/users/UserBottomCards";
import { Suspense } from "react";

export default async function UsersPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  // totalPages tidak diperlukan lagi di sini karena sudah dipindah ke dalam UserList

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">
          <DashboardPageHeader
            eyebrow="User Management"
            title="Users"
            subtitle="Manage employee accounts, roles, and terminal access."
          />

          {/* HEADER METRICS DENGAN SUSPENSE */}
          <Suspense 
            fallback={
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Skeleton untuk Kotak Putih Kiri */}
                <div className="bg-white p-5 rounded-xl shadow-sm md:col-span-2 h-[116px] animate-pulse flex flex-col justify-center">
                  <div className="h-3 w-1/4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                {/* Skeleton untuk Kotak Biru Kanan */}
                <div className="bg-blue-900 p-5 rounded-xl shadow-sm h-[116px] animate-pulse flex flex-col justify-center">
                  <div className="h-5 w-1/2 bg-blue-800 rounded mb-3"></div>
                  <div className="h-4 w-3/4 bg-blue-800 rounded mb-4"></div>
                  <div className="h-3 w-2/3 bg-blue-800 rounded"></div>
                </div>
              </div>
            }
          >
            <UserMetrics />
          </Suspense>

          {/* 🌟 LANGSUNG PANGGIL USER LIST DI SINI */}
          {/* Card putih, tombol New User, dan Pagination semuanya sudah di-handle di dalam UserList */}
          <div className="mb-6">
            <Suspense key={query + currentPage} fallback={<UserTableSkeleton />}>
              <UserList query={query} currentPage={currentPage} />
            </Suspense>
          </div>

          {/* BOTTOM SECTION DENGAN SUSPENSE */}
          <Suspense
            fallback={
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm h-[132px] animate-pulse">
                    <div className="h-5 w-1/3 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <UserBottomCards />
          </Suspense>

        </div>
      </div>
    </div>
  );
}