"use client";

import { useCart } from "./CartProvider";

export default function AddToCartButton({
  slug,
  name,
  price,
  className = "",
  label,
}: {
  slug: string;
  name: string;
  price: number;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  return (
    <button
      onClick={() => add({ slug, name, price })}
      className={
        className ||
        "w-full rounded-full bg-espresso py-3 text-sm tracking-widest text-cream transition-colors hover:bg-espresso-soft"
      }
    >
      {label ?? `เพิ่มใส่ตะกร้า — ฿${price.toLocaleString("th-TH")}`}
    </button>
  );
}
