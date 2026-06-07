"use server";

import { loginUser, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _prev: string | undefined,
  formData: FormData
): Promise<string | never> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return "Email dan password harus diisi.";
  }

  const user = await loginUser(email, password);
  if (!user) {
    return "Email atau password salah.";
  }

  await setSessionCookie(user);

  // Set readable role cookie for client-side sidebar menu control
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set("nimbus_role", user.role, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete("nimbus_role");
  redirect("/login");
}
