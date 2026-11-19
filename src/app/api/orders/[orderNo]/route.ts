import { NextRequest, NextResponse } from "next/server";
import { getOrderByNo } from "@/lib/orders";
import { currentUser } from "@/lib/auth";
import { getShopConfig } from "@/lib/settings";
import generatePayload from "promptpay-qr";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const found = getOrderByNo(orderNo);
  if (!found) return NextResponse.json({ error: "ไม่พบออเดอร์" }, { status: 404 });

  // guest ต้องยืนยันด้วยเบอร์ที่สั่ง (?phone=...) หรือเจ้าของที่ล็อกอิน
  const url = new NextRequest(_req.url);
  const phoneParam = url.nextUrl.searchParams.get("phone")?.trim();
  const user = await currentUser();
  const isOwner = user && found.order.userId === user.id;
  const isAdmin = user?.role === "admin";
  const phoneMatch = phoneParam && phoneParam === found.order.phone;

  if (!isOwner && !isAdmin && !phoneMatch) {
    return NextResponse.json({ error: "กรุณายืนยันเบอร์โทรที่ใช้สั่งซื้อ" }, { status: 403 });
  }

  const cfg = getShopConfig();
  const promptpayPayload =
    found.order.paymentMethod === "promptpay" && cfg.promptpayId && found.order.paymentStatus === "pending"
      ? generatePayload(cfg.promptpayId, { amount: found.order.total })
      : null;

  return NextResponse.json({
    order: found.order,
    items: found.items,
    promptpayPayload,
    bankAccounts: cfg.bankAccounts,
  });
}
