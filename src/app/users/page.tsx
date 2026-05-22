import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import SearchWrapper from "@/components/SearchWrapper";
import Pagination from "@/components/pagination";
import UserList from "@/components/users/UserList";
import UserTableSkeleton from "@/components/users/UserSkeleton";
import UserMetrics from "@/components/users/UserMetrics"; // <-- Import komponen baru
import { Suspense } from "react";
import UserBottomCards from "@/components/users/UserBottomCards";

export default async function UsersPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = 5;

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-6 pb-6 overflow-y-auto">

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

          {/* TABLE CARD */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            
            {/* TOP BAR WITH DYNAMIC SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <p className="font-semibold">System Operators & Administrators</p>
              
              <div className="flex w-full md:w-auto gap-3 items-center">
                <div className="w-full md:w-64">
                  {/* SKELETON UNTUK SEARCH BAR */}
                  <Suspense fallback={<div className="h-[42px] w-full bg-gray-200 rounded-md animate-pulse"></div>}>
                    <SearchWrapper placeholder="Search by name or ID..." />
                  </Suspense>
                </div>
                <button className="bg-blue-700 text-white px-4 py-[9px] rounded-md text-sm flex-shrink-0 hover:bg-blue-800 transition">
                  + New User
                </button>
              </div>
            </div>

            {/* TABLE LIST WITH SKELETON SUSPENSE */}
            <Suspense key={query + currentPage} fallback={<UserTableSkeleton />}>
              <UserList query={query} currentPage={currentPage} />
            </Suspense>

            {/* FOOTER WITH DYNAMIC PAGINATION */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
              <p>Showing users</p>
              <div className="scale-90">
                <Pagination totalPages={totalPages} />
              </div>
            </div>
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