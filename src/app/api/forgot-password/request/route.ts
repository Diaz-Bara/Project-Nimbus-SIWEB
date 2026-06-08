import { NextResponse } from "next/server";
import { requestPasswordOtp } from "@/lib/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "");
    const empId = String(body.empId || body.employeeId || "");
    const result = await requestPasswordOtp(email, empId);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      email: result.email,
      empId: result.empId,
      demoOtp: result.demoOtp,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "A system error occurred." },
      { status: 500 }
    );
  }
}