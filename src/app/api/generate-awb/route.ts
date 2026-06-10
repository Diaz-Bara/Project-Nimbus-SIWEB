import { NextResponse } from "next/server";
import { getNextAwb } from "@/lib/actions";

export async function GET() {
  try {
    const awb = await getNextAwb();
    return NextResponse.json({ awb });
  } catch (error) {
    console.error("generate-awb error:", error);
    return NextResponse.json({ awb: null, error: "Failed to generate AWB" }, { status: 500 });
  }
}