export function isNotFoundError(error: Error & { digest?: string }) {
  const digest = String(error.digest || "");
  const message = String(error.message || "");

  return (
    digest === "NEXT_NOT_FOUND" ||
    message === "NEXT_NOT_FOUND" ||
    digest.includes("NEXT_NOT_FOUND") ||
    message.toLowerCase().includes("not found")
  );
}