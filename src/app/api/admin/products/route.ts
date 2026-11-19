import { NextRequest, NextResponse } from "next/server";
import { db } from "@db/client";
import { products, productIngredients, routineSteps } from "@db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await currentUser();
  return user?.role === "admin" ? user : null;
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body?.slug) return NextResponse.json({ error: "ต้องระบุ slug" }, { status: 400 });

  const p = db.select().from(products).where(eq(products.slug, String(body.slug))).all()[0];
  if (!p) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });

  const patch: Partial<typeof products.$inferInsert> = {};
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) return NextResponse.json({ error: "ราคาไม่ถูกต้อง" }, { status: 400 });
    patch.price = Math.round(price);
  }
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (!Number.isFinite(stock) || stock < 0) return NextResponse.json({ error: "สต็อกไม่ถูกต้อง" }, { status: 400 });
    patch.stock = Math.round(stock);
  }
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: "ไม่มีค่าที่จะแก้" }, { status: 400 });

  db.update(products).set(patch).where(eq(products.slug, p.slug)).run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body?.slug) return NextResponse.json({ error: "ต้องระบุ slug" }, { status: 400 });

  const p = db.select().from(products).where(eq(products.slug, String(body.slug))).all()[0];
  if (!p) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });

  db.delete(productIngredients).where(eq(productIngredients.productSlug, p.slug)).run();
  db.delete(routineSteps).where(eq(routineSteps.productSlug, p.slug)).run();
  db.delete(products).where(eq(products.slug, p.slug)).run();
  return NextResponse.json({ ok: true });
}
