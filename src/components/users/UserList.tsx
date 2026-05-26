import UserInteractive from "./UserInteractive";
import SearchWrapper from "@/components/SearchWrapper";
import Pagination from "@/components/pagination";
import { Suspense } from "react";

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
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const users: User[] = [
    { id: 1, initials: "BS", name: "Boas Salosa", email: "boas.s@nimbus.cargo", empId: "ADM-99210", role: "ADMIN", terminal: "Global Access", lastLogin: "12 mins ago", status: "ACTIVE" },
    { id: 2, initials: "JI", name: "Jay Idzes", email: "jay.i@nimbus.cargo", empId: "ADM-88432", role: "ADMIN", terminal: "CGK-Main", lastLogin: "2 hours ago", status: "ACTIVE" },
    { id: 3, initials: "BP", name: "Bambang Pamungkas", email: "bambang.p@nimbus.cargo", empId: "OPR-77001", role: "OPERATOR", terminal: "DPS-Terminal", lastLogin: "3 days ago", status: "INACTIVE" },
    { id: 4, initials: "JH", name: "Justin Hubner", email: "justin.h@nimbus.cargo", empId: "OPR-88544", role: "OPERATOR", terminal: "KNO-Gateway", lastLogin: "5 mins ago", status: "ACTIVE" },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.empId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <UserInteractive 
      initialData={filteredUsers}
      searchComponent={
        <Suspense fallback={<div className="h-[42px] w-full bg-gray-200 rounded-md animate-pulse"></div>}>
          <SearchWrapper placeholder="Search by name or ID..." />
        </Suspense>
      }
      paginationComponent={
        <Pagination totalPages={5} /> 
      }
    />
  );
}