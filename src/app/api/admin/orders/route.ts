import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { listOrders, updateOrderStatus, deleteOrder } from "@/lib/orders";

async function requireAdmin() {
  const user = await currentUser();
  return user?.role === "admin" ? user : null;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ orders: listOrders(100) });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body?.orderNo || !body?.status) {
    return NextResponse.json({ error: "ต้องระบุ orderNo และ status" }, { status: 400 });
  }
  const ok = updateOrderStatus(String(body.orderNo), String(body.status), body.trackingNo);
  if (!ok) return NextResponse.json({ error: "อัปเดตไม่สำเร็จ" }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body?.orderNo) {
    return NextResponse.json({ error: "ต้องระบุ orderNo" }, { status: 400 });
  }
  const ok = deleteOrder(String(body.orderNo));
  if (!ok) return NextResponse.json({ error: "ไม่พบออเดอร์" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
