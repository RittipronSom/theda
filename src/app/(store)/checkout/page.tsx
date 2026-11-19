"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

const thb = (n: number) => "฿" + n.toLocaleString("th-TH");

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "promptpay" as "promptpay" | "bank",
  });
  const [me, setMe] = useState<{ name: string; phone: string } | null>(null);
  const [imageMap, setImageMap] = useState<Record<string, string | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, string | null> = {};
        for (const p of d.products || []) map[p.slug] = p.image;
        setImageMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setMe(d.user);
          setForm((f) => ({ ...f, customerName: f.customerName || d.user.name, phone: f.phone || d.user.phone }));
        }
      })
      .catch(() => {});
  }, []);

  const shippingFee = useMemo(() => (total >= 500 ? 0 : items.length ? 50 : 0), [total, items.length]);
  const grandTotal = total + shippingFee;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }
      clear();
      window.location.href = `/orders/${data.orderNo}`;
    } catch {
      setError("เชื่อมต่อไม่ได้ ลองอีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-40 pb-24 text-center">
        <h1 className="font-display text-3xl">ตะกร้าว่างเปล่า</h1>
        <p className="mt-3 text-sm text-taupe">เลือกผลิตภัณฑ์ก่อนเข้าสู่ขั้นตอนชำระเงิน</p>
        <Link href="/#products" className="mt-8 inline-block rounded-full bg-espresso px-8 py-3 text-sm tracking-widest text-cream">
          สำรวจผลิตภัณฑ์
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 lg:px-8">
      <h1 className="font-display text-4xl">ชำระเงิน</h1>
      <p className="mt-2 text-xs tracking-[0.2em] text-taupe">CHECKOUT — THEDA OFFICIAL STORE</p>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <section className="card-frame rounded-2xl p-7">
            <h2 className="font-display text-xl">ข้อมูลการจัดส่ง</h2>
            {!me && (
              <p className="mt-2 text-xs text-taupe">
                สั่งเป็นสมาชิกหรือไม่ก็ได้ (guest) —{" "}
                <Link href="/login" className="text-gold underline">
                  เข้าสู่ระบบ
                </Link>{" "}
                เพื่อบันทึกประวัติออเดอร์
              </p>
            )}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="ชื่อผู้รับ *">
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="เบอร์โทรศัพท์ *">
                <input
                  required
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input"
                />
              </Field>
            </div>
            <Field label="ที่อยู่จัดส่ง *" className="mt-4">
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="บ้านเลขที่ ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                className="input"
              />
            </Field>
            <Field label="หมายเหตุ (ถ้ามี)" className="mt-4">
              <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input" />
            </Field>
          </section>

          <section className="card-frame rounded-2xl p-7">
            <h2 className="font-display text-xl">วิธีชำระเงิน</h2>
            <div className="mt-5 space-y-3">
              <PayOption
                active={form.paymentMethod === "promptpay"}
                onClick={() => setForm({ ...form, paymentMethod: "promptpay" })}
                title="PromptPay QR"
                desc="สแกนจ่ายได้ทันทีหลังยืนยันออเดอร์ — ระบบสร้าง QR พร้อมยอดเงินให้อัตโนมัติ"
              />
              <PayOption
                active={form.paymentMethod === "bank"}
                onClick={() => setForm({ ...form, paymentMethod: "bank" })}
                title="โอนผ่านธนาคาร"
                desc="โอนแล้วแจ้งสลิปทาง LINE หรือ SMS — ระบบจะแสดงเลขบัญชีหลังยืนยันออเดอร์"
              />
              <div className="rounded-xl border border-dashed border-espresso/20 p-4 opacity-55">
                <p className="text-sm font-medium">บัตรเครดิต / เดบิต</p>
                <p className="mt-1 text-xs text-taupe">เร็ว ๆ นี้ (Omise / 2C2P — รอเปิดบัญชีร้านค้า)</p>
              </div>
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="card-frame h-fit rounded-2xl p-7 lg:sticky lg:top-28">
          <h2 className="font-display text-xl">สรุปออเดอร์</h2>
          <ul className="mt-5 space-y-3 border-b border-espresso/10 pb-5">
            {items.map((i) => (
              <li key={i.slug} className="flex items-center gap-3 text-sm">
                <span className="flex h-14 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ivory">
                  {imageMap[i.slug] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageMap[i.slug]!} alt={i.name} className="h-12 w-auto object-contain" />
                  ) : (
                    <span className="font-display text-base italic text-gold">
                      {i.name.replace("THEDA ", "").charAt(0)}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1 leading-snug">
                  {i.name} <span className="text-taupe">× {i.qty}</span>
                </span>
                <span className="whitespace-nowrap">{thb(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 py-5 text-sm">
            <div className="flex justify-between text-taupe">
              <span>ยอดรวมสินค้า</span>
              <span>{thb(total)}</span>
            </div>
            <div className="flex justify-between text-taupe">
              <span>ค่าจัดส่ง</span>
              <span>{shippingFee === 0 ? "ฟรี" : thb(shippingFee)}</span>
            </div>
            {shippingFee > 0 && (
              <p className="text-[0.68rem] text-gold">ซื้อเพิ่ม {thb(500 - total)} รับสิทธิ์ส่งฟรี</p>
            )}
          </div>
          <div className="flex items-baseline justify-between border-t border-espresso/10 pt-5">
            <span className="text-sm text-taupe">รวมทั้งสิ้น</span>
            <span className="font-display text-3xl">{thb(grandTotal)}</span>
          </div>

          {error && <p className="mt-4 rounded-lg bg-espresso px-4 py-3 text-xs text-cream">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-espresso py-4 text-sm tracking-[0.2em] text-cream transition-colors hover:bg-gold hover:text-white disabled:opacity-50"
          >
            {submitting ? "กำลังดำเนินการ..." : "ยืนยันออเดอร์"}
          </button>
          <p className="mt-3 text-center text-[0.65rem] tracking-wide text-taupe">
            ผ่านการทดสอบทางผิวหนัง · รับประกัน 30 วัน
          </p>
        </aside>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgba(30, 58, 110, 0.25);
          background: #fff;
          border-radius: 0.6rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #cf242b;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs tracking-wide text-taupe">{label}</span>
      {children}
    </label>
  );
}

function PayOption({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        active ? "border-gold bg-white ring-1 ring-gold" : "border-espresso/15 hover:border-gold/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-4 w-4 rounded-full border ${active ? "border-gold bg-gold" : "border-espresso/30"}`}
        />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="mt-1.5 pl-7 text-xs leading-relaxed text-taupe">{desc}</p>
    </button>
  );
}
