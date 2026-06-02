import ShipmentInteractive from "@/components/shipments/ShipmentInteractive";
import { fetchShipments } from "@/lib/actions";

export default async function ShipmentList({
  query,
  currentPage,
  isManagePage = false,
}: {
  query: string;
  currentPage: number;
  isManagePage?: boolean;
}) {
  // Mengambil data langsung dari PostgreSQL (Neon)
  const shipments = await fetchShipments(query, currentPage);

  return <ShipmentInteractive initialData={shipments} isManagePage={isManagePage} />;
}
