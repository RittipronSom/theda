"use client";

import { useState } from "react";

export function EditableCell({
  slug,
  field,
  value,
  suffix,
}: {
  slug: string;
  field: "price" | "stock";
  value: number;
  suffix: string;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save(v: string) {
    setState("saving");
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, [field]: Number(v) }),
    });
    setState(res.ok ? "saved" : "error");
    setTimeout(() => setState("idle"), 1500);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <input
        defaultValue={value}
        onBlur={(e) => {
          if (Number(e.target.value) !== value) save(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className="w-20 rounded-lg border border-espresso/15 bg-white px-2.5 py-1.5 text-right text-sm outline-none focus:border-gold"
      />
      <span className="w-10 text-xs text-taupe">
        {state === "saving" ? "..." : state === "saved" ? "✓" : state === "error" ? "✗" : suffix}
      </span>
    </span>
  );
}

export function DeleteProductButton({ slug, name }: { slug: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function doDelete() {
    setDeleting(true);
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) window.location.reload();
    else {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <button
          onClick={doDelete}
          disabled={deleting}
          className="rounded-lg bg-espresso px-3 py-1.5 text-[0.68rem] tracking-wide text-cream transition-colors hover:bg-red-800 disabled:opacity-50"
        >
          {deleting ? "..." : "ยืนยันลบ"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-taupe underline">
          ยกเลิก
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`ลบสินค้า ${name}`}
      className="rounded-lg border border-espresso/15 px-3 py-1.5 text-[0.68rem] tracking-wide text-taupe transition-colors hover:border-red-700 hover:text-red-700"
    >
      ลบ
    </button>
  );
}

export function StatusSelect({ orderNo, status }: { orderNo: string; status: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save(v: string) {
    setState("saving");
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNo, status: v }),
    });
    setState(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => window.location.reload(), 400);
    else setTimeout(() => setState("idle"), 1500);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <select
        defaultValue={status}
        onChange={(e) => save(e.target.value)}
        className="rounded-lg border border-espresso/15 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-gold"
      >
        <option value="waiting_payment">รอชำระเงิน</option>
        <option value="paid">ชำระแล้ว — รอจัดส่ง</option>
        <option value="shipped">จัดส่งแล้ว</option>
        <option value="completed">เสร็จสิ้น</option>
        <option value="cancelled">ยกเลิก</option>
      </select>
      {state === "saving" && <span className="text-xs text-taupe">...</span>}
      {state === "error" && <span className="text-xs text-red-600">✗</span>}
    </span>
  );
}

export function OrderRow({
  orderNo,
  date,
  name,
  pay,
  total,
  status,
  trackingNo,
}: {
  orderNo: string;
  date: string;
  name: string;
  pay: string;
  total: string;
  status: string;
  trackingNo: string | null;
}) {
  const [tracking, setTracking] = useState(trackingNo ?? "");
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");

  async function saveTracking() {
    if (tracking === (trackingNo ?? "")) return;
    setSaved("saving");
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNo, status, trackingNo: tracking }),
    });
    setSaved(res.ok ? "saved" : "saving");
    setTimeout(() => setSaved("idle"), 1500);
  }

  return (
    <tr className="border-b border-espresso/5 last:border-0">
      <td className="px-5 py-3 font-display">{orderNo}</td>
      <td className="px-5 py-3 text-xs text-taupe">{date}</td>
      <td className="px-5 py-3">{name}</td>
      <td className="px-5 py-3 text-xs text-taupe">{pay}</td>
      <td className="px-5 py-3 whitespace-nowrap">{total}</td>
      <td className="px-5 py-3">
        <div className="flex flex-col gap-2">
          <StatusSelect orderNo={orderNo} status={status} />
          {status === "shipped" && (
            <span className="flex items-center gap-1.5">
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                onBlur={saveTracking}
                placeholder="เลข tracking"
                className="w-32 rounded-lg border border-espresso/15 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-gold"
              />
              <span className="text-[0.65rem] text-taupe">
                {saved === "saving" ? "..." : saved === "saved" ? "✓" : ""}
              </span>
            </span>
          )}
        </div>
      </td>
      <td className="px-5 py-3">
        <DeleteOrderButton orderNo={orderNo} />
      </td>
    </tr>
  );
}

function DeleteOrderButton({ orderNo }: { orderNo: string }) {
  const [confirming, setConfirming] = useState(false);

  async function doDelete() {
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNo }),
    });
    if (res.ok) window.location.reload();
    else setConfirming(false);
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <button
          onClick={doDelete}
          className="rounded-lg bg-espresso px-3 py-1.5 text-[0.68rem] tracking-wide text-cream transition-colors hover:bg-red-800"
        >
          ยืนยันลบ
        </button>
        <button onClick={() => setConfirming(false)} className="text-taupe underline">
          ยกเลิก
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`ลบออเดอร์ ${orderNo}`}
      className="rounded-lg border border-espresso/15 px-3 py-1.5 text-[0.68rem] tracking-wide text-taupe transition-colors hover:border-red-700 hover:text-red-700"
    >
      ลบ
    </button>
  );
}
