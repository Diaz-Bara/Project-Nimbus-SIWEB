import UserInteractive from "./UserInteractive";
import SearchWrapper from "@/components/SearchWrapper";
import Pagination from "@/components/pagination";
import { Suspense } from "react";
import { fetchUsers, fetchUsersCount } from "@/lib/actions";

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
  const [users, totalUsers] = await Promise.all([
    fetchUsers(query, currentPage),
    fetchUsersCount(query),
  ]);
  const totalPages = Math.ceil(totalUsers / 4);

  const startUser = totalUsers === 0 ? 0 : (currentPage - 1) * 4 + 1;
  const endUser = Math.min(currentPage * 4, totalUsers);

  return (
    <UserInteractive 
      initialData={users as User[]}
      summaryText={`Showing ${startUser}-${endUser} of ${totalUsers} employees`}
      searchComponent={
        <Suspense fallback={<div className="h-[42px] w-full bg-gray-200 rounded-md animate-pulse"></div>}>
          <SearchWrapper placeholder="Search by name or ID..." />
        </Suspense>
      }
      paginationComponent={
        totalPages > 1 ? <Pagination totalPages={totalPages} /> : null
      }
    />
  );
}
