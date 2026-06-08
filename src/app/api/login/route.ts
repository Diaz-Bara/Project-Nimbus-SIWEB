import { NextResponse } from "next/server";
import { loginUser } from "@/lib/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.email || body.username || "");
    const password = String(body.password || "");
    const result = await loginUser(username, password);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          usernameError: result.usernameError,
          passwordError: result.passwordError,
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      email: result.email,
      role: result.role,
    });

    response.cookies.set("app_user", result.email, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
    });
    response.cookies.set("app_role", result.role, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "A system error occurred." },
      { status: 500 }
    );
  }
}