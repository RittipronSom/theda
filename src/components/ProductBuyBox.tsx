"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function ProductBuyBox({
  slug,
  name,
  price,
  compact = false,
}: {
  slug: string;
  name: string;
  price: number;
  compact?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  return (
    <div className={compact ? "" : "border border-espresso/15 p-5"}>
      <div className="flex items-stretch">
        <div className="flex items-center border-r border-espresso/15">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className={`text-lg text-taupe transition-colors hover:text-espresso ${compact ? "px-3 py-2" : "px-4 py-3"}`}
            aria-label="ลดจำนวน"
          >
            −
          </button>
          <span className="w-9 text-center font-display text-lg">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className={`text-lg text-taupe transition-colors hover:text-espresso ${compact ? "px-3 py-2" : "px-4 py-3"}`}
            aria-label="เพิ่มจำนวน"
          >
            +
          </button>
        </div>
        <button
          onClick={() => add({ slug, name, price }, qty)}
          className={`flex-1 bg-espresso text-[0.78rem] font-semibold tracking-[0.18em] text-cream transition-colors hover:bg-espresso-soft ${compact ? "py-3" : "py-4"}`}
        >
          เพิ่มใส่ตะกร้า — ฿{(price * qty).toLocaleString("th-TH")}
        </button>
      </div>
      {!compact && (
        <p className="mt-4 text-center text-[0.65rem] tracking-[0.22em] text-taupe">
          ผ่านการทดสอบทางผิวหนัง · ไม่ทดสอบกับสัตว์ · รับประกัน 30 วัน
        </p>
      )}
    </div>
  );
}
