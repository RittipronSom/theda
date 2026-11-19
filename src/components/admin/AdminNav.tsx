"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "ออเดอร์" },
  { href: "/admin/products", label: "สินค้า & สต็อก" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="border-t border-cream/10">
      <div className="mx-auto flex max-w-7xl gap-8 px-5 lg:px-8">
        {MENU.map((m) => {
          const active = m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href);
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`-mb-px border-b-2 py-3 text-[0.78rem] tracking-[0.15em] transition-colors ${
                active
                  ? "border-gold text-gold-light"
                  : "border-transparent text-cream/60 hover:text-cream"
              }`}
            >
              {m.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
