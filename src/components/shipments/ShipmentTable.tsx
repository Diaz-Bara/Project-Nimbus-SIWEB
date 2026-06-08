"use client";

import Link from "next/link";

type Shipment = {
  id: number;
  awb: string;
  origin: string;
  destination: string;
  weight: number;
  pieces: number;
  status: string;
};

// 💡 onCreate dan onEdit sudah dihapus dari Props karena kita menggunakan <Link>
type Props = {
  data: Shipment[];
  onDelete: (id: number) => void;
};

export default function ShipmentTable({
  data,
  onDelete,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">Active Freight</p>

        {/* 🌟 UBAH: Button diganti menjadi Link yang mengarah ke halaman create */}
        <Link
          href="/shipments/create"
          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm inline-block"
        >
          + Create Shipment
        </Link>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="text-gray-400 text-xs">
          <tr className="text-center">
            <th>AWB</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Weight</th>
            <th>Pieces</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t text-center">

              <td>{item.awb}</td>
              <td>{item.origin}</td>
              <td>{item.destination}</td>
              <td>{item.weight}</td>
              <td>{item.pieces}</td>

              {/* STATUS */}
              <td
                className={
                  item.status === "In Transit"
                    ? "text-blue-600 font-medium"
                    : item.status === "Scheduled"
                    ? "text-orange-500 font-medium"
                    : "text-gray-500 font-medium"
                }
              >
                {item.status}
              </td>

              {/* ACTION */}
              <td className="space-x-2 py-2">
                {/* 🌟 UBAH: Button Edit diganti menjadi Link dengan rute dinamis berdasarkan ID */}
                <Link
                  href={`/shipments/${item.id}/edit`}
                  className="bg-blue-500 text-white px-2 py-1.5 rounded hover:bg-blue-600 inline-block"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
