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
  const name = String(body.name || "").trim();
  const email = body.email ? String(body.email).trim() : null;

  if (!/^[0-9]{9,10}$/.test(phone)) {
    return NextResponse.json({ error: "เบอร์โทรไม่ถูกต้อง (9-10 หลัก)" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "รหัสผ่านต้องยาวอย่างน้อย 6 ตัว" }, { status: 400 });
  }
  if (!name) return NextResponse.json({ error: "กรุณากรอกชื่อ" }, { status: 400 });

  const exists = db.select().from(users).all().find((u) => u.phone === phone);
  if (exists) {
    return NextResponse.json({ error: "เบอร์นี้สมัครสมาชิกแล้ว" }, { status: 409 });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const res = db
    .insert(users)
    .values({ phone, email, passwordHash, name, birthday: body.birthday || null, role: "customer", createdAt: Date.now() })
    .run();

  const token = createSession(Number(res.lastInsertRowid));
  const resp = NextResponse.json({ ok: true, user: { phone, name } });
  resp.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(60 * 60 * 24 * 30, req));
  return resp;
}
