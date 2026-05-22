export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100">
      <td className="whitespace-nowrap px-3 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="whitespace-nowrap px-3 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="whitespace-nowrap px-3 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="whitespace-nowrap px-3 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="whitespace-nowrap px-3 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div></td>
      <td className="whitespace-nowrap py-4 pl-6 pr-3 flex justify-end gap-3">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </td>
    </tr>
  );
}

export default function ShipmentTableSkeleton() {
  return (
    <div className="mt-2 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-xl bg-white p-2 md:pt-0 shadow-sm border border-gray-200">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal text-gray-500">
              <tr>
                <th className="px-3 py-5 font-medium">AWB</th>
                <th className="px-3 py-5 font-medium">Origin</th>
                <th className="px-3 py-5 font-medium">Destination</th>
                <th className="px-3 py-5 font-medium">Weight/Pcs</th>
                <th className="px-3 py-5 font-medium">Status</th>
                <th className="relative py-3 pl-6 pr-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Munculkan 4 baris efek loading */}
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}