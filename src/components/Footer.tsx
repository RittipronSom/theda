"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/contact") {
    return (
      <footer className="border-t border-espresso/10 bg-white py-7">
        <div className="site-container flex flex-wrap items-center gap-x-16 gap-y-6">
          <Link href="/" className="brand-logo" aria-label="THEDA หน้าแรก"><span className="brand-symbol" aria-hidden="true"><Image src="/images/logo.png" alt="" width={252} height={252} /></span><span>THEDA</span></Link>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm sm:mx-auto" aria-label="เมนูท้ายหน้า">
            <Link href="/">หน้าแรก</Link><Link href="/#products">ผลิตภัณฑ์</Link><Link href="/#philosophy">รู้จัก THEDA</Link><Link href="/contact" aria-current="page">ติดต่อเรา</Link>
          </nav>
        </div>
      </footer>
    );
  }
  return (
    <footer id="contact" className="bg-espresso text-cream/70">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl leading-snug text-cream">
              THEDA — เพราะความอ่อนเยาว์
              <br />
              ไม่ควรเป็นเพียงความทรงจำ
            </p>
            <div className="hairline mt-6 w-40" />
            <p className="mt-6 text-sm leading-relaxed">
              สกินแคร์พรีเมียมที่ผสานวิทยาศาสตร์ขั้นสูง
              <br />
              และสารสกัดจากธรรมชาติ
            </p>
          </div>

          <FooterCol
            title="สินค้า"
            links={[
              { label: "ผลิตภัณฑ์ทั้งหมด", href: "/#products" },
              { label: "ทำความสะอาด", href: "/products/hydro-matrix-deep-cream" },
              { label: "เซรั่ม", href: "/products/glow-serum" },
              { label: "บำรุงผิว", href: "/products/night-repair-cream" },
              { label: "บอดี้แคร์", href: "/#products" },
            ]}
          />
          <FooterCol
            title="เกี่ยวกับ"
            links={[
              { label: "เรื่องราวของเรา", href: "/#philosophy" },
              { label: "ส่วนผสม", href: "/#ingredients" },
              { label: "ความยั่งยืน", href: "/#philosophy" },
              { label: "สื่อ", href: "/#products" },
            ]}
          />
          <FooterCol
            title="ช่วยเหลือ"
            links={[
              { label: "ติดต่อเรา", href: "/contact" },
              { label: "จัดส่ง", href: "/#contact" },
              { label: "การคืนสินค้า", href: "/#contact" },
              { label: "คำถามที่พบบ่อย", href: "/#contact" },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs md:flex-row">
          <p>© 2026 THEDA. สงวนลิขสิทธิ์.</p>
          <p>คัดสรรด้วยความตั้งใจจากกรุงเทพฯ</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="label-caps text-gold-light">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm transition-colors hover:text-cream">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
