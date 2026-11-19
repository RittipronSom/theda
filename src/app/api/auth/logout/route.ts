import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) destroySession(token);
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return resp;
}
