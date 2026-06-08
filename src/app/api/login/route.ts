import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_ERRORS, mapDbRole, validateLoginInput } from "@/lib/auth-credentials";
import { loginUser, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.email || body.username || "");
    const password = String(body.password || "");

    const validation = validateLoginInput(username, password);
    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          error: AUTH_ERRORS.required,
          usernameError: validation.usernameError,
          passwordError: validation.passwordError,
        },
        { status: 400 },
      );
    }

    const user = await loginUser(username, password);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: AUTH_ERRORS.invalidCredentials,
          usernameError: null,
          passwordError: null,
        },
        { status: 401 },
      );
    }

    await setSessionCookie(user);

    const cookieStore = await cookies();
    cookieStore.set("nimbus_role", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      email: user.email,
      role: mapDbRole(user.role),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "A system error occurred." },
      { status: 500 },
    );
  }
}