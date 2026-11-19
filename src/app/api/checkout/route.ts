import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { createOrder } from "@/lib/orders";
import { getShopConfig } from "@/lib/settings";
import generatePayload from "promptpay-qr";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const user = await currentUser();
  const result = createOrder({
    items: Array.isArray(body.items) ? body.items : [],
    customerName: String(body.customerName || user?.name || ""),
    phone: String(body.phone || user?.phone || ""),
    address: String(body.address || ""),
    paymentMethod: body.paymentMethod,
    note: body.note ? String(body.note) : undefined,
    userId: user?.id ?? null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const cfg = getShopConfig();
  const promptpayPayload =
    body.paymentMethod === "promptpay" && cfg.promptpayId
      ? generatePayload(cfg.promptpayId, { amount: result.total })
      : null;

  return NextResponse.json({
    ok: true,
    orderNo: result.orderNo,
    subtotal: result.subtotal,
    shippingFee: result.shippingFee,
    total: result.total,
    promptpayPayload,
    bankAccounts: cfg.bankAccounts,
  });
}
