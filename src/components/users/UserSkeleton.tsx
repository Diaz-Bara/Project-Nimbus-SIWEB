export function UserRowSkeleton() {
  return (
    <tr className="border-t border-gray-100">
      <td className="flex items-center gap-3 py-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </td>
      <td className="text-center"><div className="mx-auto h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="text-center"><div className="mx-auto h-5 w-16 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="text-center"><div className="mx-auto h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="text-center"><div className="mx-auto h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="text-center"><div className="mx-auto h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div></td>
      <td className="text-center"><div className="mx-auto h-5 w-5 bg-gray-200 rounded animate-pulse"></div></td>
    </tr>
  );
}

export default function UserTableSkeleton() {
  return (
    <table className="w-full text-sm">
      <thead className="text-gray-400 text-xs">
        <tr>
          <th className="text-left py-2">NAME</th>
          <th>EMPLOYEE ID</th>
          <th>ROLE</th>
          <th>TERMINAL ACCESS</th>
          <th>LAST LOGIN</th>
          <th>STATUS</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <UserRowSkeleton />
        <UserRowSkeleton />
        <UserRowSkeleton />
        <UserRowSkeleton />
      </tbody>
    </table>
  );
}