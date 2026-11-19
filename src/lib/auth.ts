import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { db } from "@db/client";
import { users, sessions } from "@db/schema";
import { eq, lt } from "drizzle-orm";

export const SESSION_COOKIE = "theda_session";
const SESSION_DAYS = 30;

export function createSession(userId: number): string {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  db.insert(sessions).values({ token, userId, expiresAt }).run();
  // เก็บกวาด session หมดอายุ
  db.delete(sessions).where(lt(sessions.expiresAt, Date.now())).run();
  return token;
}

export function destroySession(token: string) {
  db.delete(sessions).where(eq(sessions.token, token)).run();
}

export type SessionUser = {
  id: number;
  phone: string;
  email: string | null;
  name: string;
  role: string;
};

export function getUserByToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const rows = db
    .select({
      id: users.id,
      phone: users.phone,
      email: users.email,
      name: users.name,
      role: users.role,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.token, token))
    .all();
  const row = rows[0];
  if (!row || row.expiresAt < Date.now()) return null;
  return { id: row.id, phone: row.phone, email: row.email, name: row.name, role: row.role };
}

export async function currentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return getUserByToken(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions(maxAgeSeconds: number, request: Request) {
  const url = new URL(request.url);
  // Next.js may normalize request.url to localhost; Host retains the LAN address.
  const hostname = new URL(`http://${request.headers.get("host") || url.host}`).hostname;
  const isPrivateHost = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
  // LAN HTTP development cannot store Secure cookies. Keep HTTPS and
  // production cookies Secure, including when served behind a TLS proxy.
  const isLanHttpDev = process.env.NODE_ENV === "development" && url.protocol === "http:" && isPrivateHost;
  return {
    httpOnly: true,
    sameSite: isLanHttpDev ? "lax" as const : "none" as const,
    secure: !isLanHttpDev,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
