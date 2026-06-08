import { headers } from "next/headers";
import NotFoundView from "@/components/errors/NotFoundView";
import { getRouteContext } from "@/lib/route-context";

export default async function NotFound() {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "";
  const context = getRouteContext(pathname);

  return <NotFoundView context={context} />;
}