import { NextResponse } from "next/server";
import { resetPasswordAfterOtp } from "@/lib/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "");
    const empId = String(body.empId || body.employeeId || "");
    const newPassword = String(body.newPassword || body.password || "");
    const confirmPassword = String(body.confirmPassword || body.confirm || "");

    const result = await resetPasswordAfterOtp(
      email,
      empId,
      newPassword,
      confirmPassword
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "A system error occurred." },
      { status: 500 }
    );
  }
}