import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { resolveAccountEmail } from "@/lib/user-credentials";

const JWT_SECRET = process.env.AUTH_SECRET || "nimbus-cargo-secret-key-2026";
const COOKIE_NAME = "nimbus_session";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
  empId: string;
  terminal: string;
}

export async function loginUser(username: string, password: string): Promise<SessionUser | null> {
  const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
  const email = resolveAccountEmail(username);
  
  try {
    const users = await sql`SELECT * FROM users WHERE LOWER(email) = ${email.toLowerCase()}`;
    if (!users[0]) return null;

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      empId: user.emp_id,
      terminal: user.terminal,
    };
  } catch (error) {
    console.error("Login error:", error);
    return null;
  } finally {
    await sql.end();
  }
}

export function createSessionToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
