"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

const NAV = [
  { href: "/", label: "หน้าแรก" },
  { href: "/#products", label: "ผลิตภัณฑ์" },
  { href: "/#philosophy", label: "รู้จัก THEDA" },
  { href: "/contact", label: "ติดต่อเรา" },
];

const thb = (n: number) => "฿" + n.toLocaleString("th-TH");

export default function Header() {
  const pathname = usePathname();
  const { count, items, total, remove, isOpen, setOpen } = useCart();
  const [imageMap, setImageMap] = useState<Record<string, string | null>>({});
  const [me, setMe] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, string | null> = {};
        for (const p of d.products || []) map[p.slug] = p.image;
        setImageMap(map);
      })
      .catch(() => {});
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user ?? null))
      .catch(() => {});
  }, []);

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs><filter id="brand-red" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0.44 0 0 0 0.56 0 2 0 0 -1 0 0 1.9 0 -0.9 0 0 0 1 0" /></filter></defs>
      </svg>
      <header className="site-header sticky top-0 z-40 bg-white">
        <div className="site-container header-inner">
          {/* left: logo */}
          <Link href="/" className="brand-logo" aria-label="THEDA หน้าแรก">
            <span className="brand-symbol" aria-hidden="true"><Image src="/images/logo.png" alt="" width={252} height={252} /></span>
            <span>THEDA</span>
          </Link>

          {/* center: nav */}
          <nav className="header-nav" aria-label="เมนูหลัก">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.href === "/contact" && pathname === "/contact" ? "page" : undefined}
                className={`transition-colors hover:text-[#cf242b] ${n.href === "/contact" && pathname === "/contact" ? "text-[#cf242b] underline decoration-2 underline-offset-8" : ""}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* right: cart */}
          <button
            onClick={() => setOpen(true)}
            className="cart-trigger"
            aria-label={`เปิดตะกร้า ${count} ชิ้น`}
          >
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h4l5 19h14l4-15H8" /><circle cx="13" cy="28" r="1.3" /><circle cx="25" cy="28" r="1.3" /></svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
        </div>
      </header>

      {/* cart drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-espresso/60" onClick={() => setOpen(false)} />
        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
            <h2 className="font-display text-xl">ตะกร้าของคุณ</h2>
            <button onClick={() => setOpen(false)} className="text-2xl leading-none text-taupe hover:text-espresso">
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <p className="mt-8 text-center text-sm text-taupe">ยังไม่มีสินค้าในตะกร้า</p>
            ) : (
              <ul className="space-y-4">
                {items.map((i) => {
                  const img = imageMap[i.slug];
                  return (
                    <li key={i.slug} className="flex items-start gap-4 border-b border-espresso/10 pb-4">
                      <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ivory">
                        {img ? (
                          <Image src={img} alt={i.name} width={56} height={56} className="h-14 w-auto object-contain" />
                        ) : (
                          <span className="font-display text-lg italic text-gold">
                            {i.name.replace("THEDA ", "").charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium leading-snug">{i.name}</p>
                        <p className="mt-1 text-xs text-taupe">
                          {i.qty} × {thb(i.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-semibold">{thb(i.qty * i.price)}</span>
                        <button onClick={() => remove(i.slug)} className="text-xs text-taupe underline hover:text-espresso">
                          ลบ
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-espresso/10 px-6 py-5">
            <Link href={me ? "/account" : "/login"} onClick={() => setOpen(false)} className="mb-4 block text-sm underline">{me ? "บัญชีของฉัน" : "เข้าสู่ระบบ / สมัครสมาชิก"}</Link>
            <div className="flex items-center justify-between text-sm">
              <span className="text-taupe">รวมทั้งสิ้น</span>
              <span className="font-display text-2xl">{thb(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className={`mt-4 block w-full rounded-full bg-espresso py-3.5 text-center text-sm tracking-widest text-cream transition-colors hover:bg-gold hover:text-white ${
                items.length === 0 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              ดำเนินการสั่งซื้อ
            </Link>
            <p className="mt-3 text-center text-xs text-taupe">ผ่านการทดสอบทางผิวหนัง · รับประกัน 30 วัน</p>
          </div>
        </aside>
      </div>
    </>
  );
}
