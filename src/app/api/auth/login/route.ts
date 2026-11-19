import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@db/client";
import { users } from "@db/schema";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const phone = String(body.phone || "").trim();
  const password = String(body.password || "");

  const user = db.select().from(users).all().find((u) => u.phone === phone);
  if (!user || !user.passwordHash || !bcrypt.compareSync(password, user.passwordHash)) {
    return NextResponse.json({ error: "เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  const token = createSession(user.id);
  const resp = NextResponse.json({ ok: true, user: { phone: user.phone, name: user.name, role: user.role } });
  resp.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(60 * 60 * 24 * 30, req));
  return resp;
}
