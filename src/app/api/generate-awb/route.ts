import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const result = await sql`
      SELECT COUNT(*)::int AS total FROM shipments
    `;
    const nextNumber = (Number(result[0]?.total || 0) + 1).toString().padStart(3, "0");
    return NextResponse.json({ awb: `AWB-${nextNumber}` });
  } catch {
    return NextResponse.json({ awb: `AWB-${Date.now()}` });
  }
}