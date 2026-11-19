import { db } from "@db/client";
import { orders, orderItems, products } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { getShopConfig } from "./settings";

export type CheckoutInput = {
  items: { slug: string; qty: number }[];
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: "promptpay" | "bank";
  note?: string;
  userId?: number | null;
};

export type CheckoutResult =
  | { ok: true; orderNo: string; total: number; shippingFee: number; subtotal: number }
  | { ok: false; error: string };

function genOrderNo(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TH-${ymd}-${rand}`;
}

export function createOrder(input: CheckoutInput): CheckoutResult {
  if (!input.items?.length) return { ok: false, error: "ไม่มีสินค้าในตะกร้า" };
  if (!input.customerName?.trim()) return { ok: false, error: "กรุณากรอกชื่อผู้รับ" };
  if (!/^[0-9+\-\s]{9,15}$/.test(input.phone?.trim() || "")) return { ok: false, error: "เบอร์โทรไม่ถูกต้อง" };
  if (!input.address?.trim() || input.address.trim().length < 10)
    return { ok: false, error: "กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน" };
  if (!["promptpay", "bank"].includes(input.paymentMethod))
    return { ok: false, error: "วิธีชำระเงินไม่ถูกต้อง" };

  // ตรวจสอบราคา/สต็อกจาก DB เสมอ (ไม่ trust client)
  const lines: { slug: string; name: string; price: number; qty: number }[] = [];
  for (const it of input.items) {
    const qty = Math.max(1, Math.min(99, Math.floor(it.qty)));
    const p = db.select().from(products).where(eq(products.slug, it.slug)).all()[0];
    if (!p) return { ok: false, error: `ไม่พบสินค้า: ${it.slug}` };
    if (p.stock < qty) return { ok: false, error: `สินค้า ${p.name} เหลือไม่พอ (มี ${p.stock} ชิ้น)` };
    lines.push({ slug: p.slug, name: p.name, price: p.price, qty });
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const cfg = getShopConfig();
  const shippingFee = subtotal >= cfg.freeShippingMin ? 0 : cfg.shippingFee;
  const total = subtotal + shippingFee;
  const orderNo = genOrderNo();

  db.transaction(() => {
    const res = db
      .insert(orders)
      .values({
        orderNo,
        userId: input.userId ?? null,
        customerName: input.customerName.trim(),
        phone: input.phone.trim(),
        address: input.address.trim(),
        subtotal,
        shippingFee,
        total,
        paymentMethod: input.paymentMethod,
        paymentStatus: "pending",
        status: "waiting_payment",
        note: input.note?.trim() || null,
        createdAt: Date.now(),
      })
      .run();
    const orderId = Number(res.lastInsertRowid);
    for (const l of lines) {
      db.insert(orderItems)
        .values({ orderId, productSlug: l.slug, name: l.name, price: l.price, qty: l.qty })
        .run();
      const p = db.select().from(products).where(eq(products.slug, l.slug)).all()[0];
      db.update(products)
        .set({ stock: p.stock - l.qty })
        .where(eq(products.slug, l.slug))
        .run();
    }
  });

  return { ok: true, orderNo, subtotal, shippingFee, total };
}

export function getOrderByNo(orderNo: string) {
  const order = db.select().from(orders).where(eq(orders.orderNo, orderNo)).all()[0];
  if (!order) return null;
  const items = db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).all();
  return { order, items };
}

export function listOrders(limit = 50) {
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit).all();
}

export function updateOrderStatus(orderNo: string, status: string, trackingNo?: string) {
  const allowed = ["waiting_payment", "paid", "shipped", "completed", "cancelled"];
  if (!allowed.includes(status)) return false;
  const order = db.select().from(orders).where(eq(orders.orderNo, orderNo)).all()[0];
  if (!order) return false;
  // ถ้ายกเลิก → คืนสต็อก
  if (status === "cancelled" && order.status !== "cancelled") {
    const items = db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).all();
    for (const it of items) {
      const p = db.select().from(products).where(eq(products.slug, it.productSlug)).all()[0];
      if (p) {
        db.update(products)
          .set({ stock: p.stock + it.qty })
          .where(eq(products.slug, it.productSlug))
          .run();
      }
    }
  }
  db.update(orders)
    .set({
      status,
      paymentStatus: status === "waiting_payment" ? "pending" : "paid",
      ...(trackingNo !== undefined ? { trackingNo } : {}),
    })
    .where(eq(orders.orderNo, orderNo))
    .run();
  return true;
}

export function deleteOrder(orderNo: string): boolean {
  const order = db.select().from(orders).where(eq(orders.orderNo, orderNo)).all()[0];
  if (!order) return false;
  db.transaction(() => {
    // คืนสต็อกถ้าออเดอร์ยังไม่ถูกยกเลิก (ยกเลิกไปแล้วคืนตอนยกเลิก)
    if (order.status !== "cancelled") {
      const items = db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).all();
      for (const it of items) {
        const p = db.select().from(products).where(eq(products.slug, it.productSlug)).all()[0];
        if (p) {
          db.update(products)
            .set({ stock: p.stock + it.qty })
            .where(eq(products.slug, it.productSlug))
            .run();
        }
      }
    }
    db.delete(orderItems).where(eq(orderItems.orderId, order.id)).run();
    db.delete(orders).where(eq(orders.id, order.id)).run();
  });
  return true;
}
