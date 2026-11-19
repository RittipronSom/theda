"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

const thb = (n: number) => "฿" + n.toLocaleString("th-TH");

const STATUS_LABEL: Record<string, string> = {
  waiting_payment: "รอชำระเงิน",
  paid: "ชำระแล้ว — รอจัดส่ง",
  shipped: "จัดส่งแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};
const STATUS_FLOW = ["waiting_payment", "paid", "shipped", "completed"];

type OrderData = {
  order: {
    orderNo: string;
    customerName: string;
    address: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    trackingNo: string | null;
    createdAt: number;
  };
  items: { name: string; price: number; qty: number }[];
  promptpayPayload: string | null;
  bankAccounts: { bank: string; name: string; no: string }[];
};

export default function OrderPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = use(params);
  const [phone, setPhone] = useState("");
  const [data, setData] = useState<OrderData | null>(null);
  const [error, setError] = useState("");
  const [qr, setQr] = useState("");

  async function load(p?: string) {
    setError("");
    const qs = p ? `?phone=${encodeURIComponent(p)}` : "";
    const res = await fetch(`/api/orders/${orderNo}${qs}`);
    const d = await res.json();
    if (!res.ok) {
      setError(d.error || "ไม่พบออเดอร์");
      return;
    }
    setData(d);
    if (d.promptpayPayload) {
      setQr(await QRCode.toDataURL(d.promptpayPayload, { width: 480, margin: 1, color: { dark: "#1e3a6e" } }));
    }
  }

  useEffect(() => {
    load();
  }, [orderNo]);

  if (error && !data) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-40 pb-24">
        <div className="card-frame rounded-2xl p-10 text-center">
          <h1 className="font-display text-2xl">ตรวจสอบออเดอร์</h1>
          {error.includes("ยืนยันเบอร์") ? (
            <>
              <p className="mt-3 text-sm text-taupe">กรอกเบอร์โทรที่ใช้สั่งซื้อเพื่อดูรายละเอียดออเดอร์ {orderNo}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  load(phone);
                }}
                className="mt-6 flex gap-3"
              >
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="08X-XXX-XXXX"
                  className="w-full rounded-xl border border-espresso/20 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
                />
                <button className="rounded-xl bg-espresso px-6 text-sm text-cream">ดูออเดอร์</button>
              </form>
            </>
          ) : (
            <p className="mt-3 text-sm text-taupe">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="pt-40 pb-24 text-center text-sm text-taupe">กำลังโหลด...</div>;
  }

  const { order } = data;
  const stepIdx = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 lg:px-8">
      <div className="text-center">
        <p className="label-caps text-gold">ขอบคุณสำหรับออเดอร์</p>
        <h1 className="mt-3 font-display text-4xl">{order.orderNo}</h1>
        <p className="mt-2 text-sm text-taupe">
          สั่งเมื่อ {new Date(order.createdAt).toLocaleString("th-TH")}
        </p>
      </div>

      {/* status timeline */}
      <div className="card-frame mt-10 rounded-2xl p-7">
        <div className="flex items-center justify-between">
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs ${
                    i <= stepIdx ? "border-gold bg-gold text-white" : "border-espresso/20 text-taupe"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`mt-2 hidden text-[0.65rem] tracking-wide sm:block ${i <= stepIdx ? "text-espresso" : "text-taupe"}`}>
                  {STATUS_LABEL[s]}
                </span>
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={`mx-2 h-px flex-1 ${i < stepIdx ? "bg-gold" : "bg-espresso/15"}`} />
              )}
            </div>
          ))}
        </div>
        {order.status === "cancelled" && (
          <p className="mt-4 rounded-xl bg-espresso px-4 py-3 text-center text-xs text-cream">
            ออเดอร์นี้ถูกยกเลิก — หากมีข้อสงสัยติดต่อ hello@theda.co
          </p>
        )}
        {order.trackingNo && (
          <p className="mt-4 text-center text-xs text-taupe">
            เลขติดตามพัสดุ: <span className="font-medium text-espresso">{order.trackingNo}</span>
          </p>
        )}
      </div>

      {/* payment */}
      {order.status === "waiting_payment" && (
        <div className="card-frame mt-6 rounded-2xl p-7">
          <h2 className="font-display text-xl">
            {order.paymentMethod === "promptpay" ? "ชำระเงินผ่าน PromptPay" : "โอนผ่านธนาคาร"}
          </h2>

          {order.paymentMethod === "promptpay" && qr ? (
            <div className="mt-5 flex flex-col items-center gap-4">
              <div className="rounded-2xl border border-espresso/10 bg-white p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="PromptPay QR" className="h-56 w-56" />
              </div>
              <div className="text-center">
                <p className="font-display text-3xl">{thb(order.total)}</p>
                <p className="mt-1 text-xs text-taupe">สแกนจ่ายด้วยแอปธนาคาร / ทรูมันนี่ วอลเล็ท</p>
                <p className="mt-2 rounded-lg bg-ivory px-4 py-2 text-[0.68rem] tracking-wider text-taupe">
                  อ้างอิง: {order.orderNo}
                </p>
              </div>
              <p className="max-w-md text-center text-[0.68rem] leading-relaxed text-taupe">
                หลังโอนเงิน ระบบ/แอดมินจะตรวจสอบและอัปเดตสถานะให้ (ปกติภายใน 1 ชม. ในเวลาทำการ)
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {data.bankAccounts.map((b) => (
                <div key={b.no} className="flex items-center justify-between rounded-xl bg-ivory px-5 py-4 text-sm">
                  <div>
                    <p className="font-medium">{b.bank}</p>
                    <p className="text-xs text-taupe">{b.name}</p>
                  </div>
                  <span className="font-display text-lg tracking-wide">{b.no}</span>
                </div>
              ))}
              <p className="text-xs leading-relaxed text-taupe">
                โอนยอด {thb(order.total)} แล้วแจ้งสลิปพร้อมเลขออเดอร์ {order.orderNo} ทาง LINE หรือ SMS
                เพื่อยืนยันการชำระเงิน
              </p>
            </div>
          )}
        </div>
      )}

      {/* items + address */}
      <div className="card-frame mt-6 rounded-2xl p-7">
        <h2 className="font-display text-xl">รายการสินค้า</h2>
        <ul className="mt-4 divide-y divide-espresso/10">
          {data.items.map((it, i) => (
            <li key={i} className="flex justify-between gap-3 py-3 text-sm">
              <span>
                {it.name} <span className="text-taupe">× {it.qty}</span>
              </span>
              <span>{thb(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-espresso/10 pt-4 text-sm">
          <div className="flex justify-between text-taupe">
            <span>ยอดรวมสินค้า</span>
            <span>{thb(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-taupe">
            <span>ค่าจัดส่ง</span>
            <span>{order.shippingFee === 0 ? "ฟรี" : thb(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between pt-2 font-display text-xl">
            <span>รวมทั้งสิ้น</span>
            <span>{thb(order.total)}</span>
          </div>
        </div>
        <div className="mt-6 rounded-xl bg-ivory px-5 py-4 text-xs leading-relaxed text-taupe">
          <p className="font-medium text-espresso">จัดส่งถึง</p>
          <p className="mt-1">
            {order.customerName} — {order.address}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/#products" className="text-xs tracking-[0.2em] text-gold hover:underline">
          ← กลับไปช้อปต่อ
        </Link>
      </div>
    </div>
  );
}
