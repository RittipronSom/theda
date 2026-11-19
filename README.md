# THEDA E-Commerce

เว็บไซต์แบรนด์ + ร้านค้าสกินแคร์พรีเมียม THEDA (Premium Anti-Aging Skincare)
สร้างใหม่จากข้อมูลจริงของ theda.co.th — ดีไซน์ตามแนว quiet luxury
(ครีม / เอสเพรสโซ / ทองแชมเปญ, serif display)

## Tech Stack

| ชั้น | เทคโนโลยี | หน้าที่ |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) + React 19 + TypeScript | SSR/SEO, หน้าแบรนด์, หน้าสินค้า, ตะกร้า (client state + localStorage) |
| **Styling** | Tailwind CSS v4 | design tokens (สี/ฟอนต์) ผ่าน `@theme` ใน `src/app/globals.css` |
| **Fonts** | next/font — Playfair Display, Noto Serif Thai (display) / Manrope, Noto Sans Thai (body) | รองรับไทย+อังกฤษในสไตล์ luxury |
| **Backend** | Next.js Route Handlers (`src/app/api/*`) | REST API: `/api/products`, `/api/products/[slug]`, `/api/ingredients`, `/api/testimonials` |
| **Database** | SQLite (better-sqlite3) + Drizzle ORM | ไฟล์ `data/theda.db` — ตาราง products, product_ingredients, hero_ingredients, routine_steps, testimonials |
| **Data layer** | `src/lib/queries.ts` | หน้าเว็บ (Server Components) เรียก query ตรง ๆ / API สำหรับงานภายนอก |

> หมายเหตุ: schema เป็น SQLite เพื่อความไวในการ dev — ย้ายขึ้น production
> เปลี่ยนเป็น PostgreSQL ได้ทันทีเพราะใช้ Drizzle ORM (แก้ dialect + connection)

## โครงสร้าง

```
C:\thedaEcom
├─ db/                 # schema, client, seed (Drizzle + SQLite)
├─ data/theda.db       # ไฟล์ฐานข้อมูล (สร้างจาก seed)
├─ public/images/      # โลโก้, รูปสินค้า, รูปก่อน-หลัง (ดึงจากเว็บเดิม)
└─ src/
   ├─ app/             # layout, หน้าหลัก, products/[slug], api/*
   ├─ components/      # Header, Hero, Philosophy, BeforeAfter, ProductGrid,
   │                   # Ingredients, Routine, Testimonials, FinalCta, Cart...
   └─ lib/queries.ts   # ฟังก์ชันอ่านข้อมูลจาก DB
```

## คำสั่ง

```bash
npm run dev        # dev server → http://localhost:3000
npm run db:seed    #  seed ข้อมูลสินค้า/ส่วนผสม/รีวิวลง SQLite ใหม่
npm run build      # build production
npm run start      # รัน production
```

## ข้อมูลทั้งหมด

- สินค้า 5 ตัว (Deep Cream / Essence / Fluid Emulsion / Glow Serum / Night Repair) ราคา-คำโปรย-ส่วนผสม จากหน้าเว็บจริง
- ส่วนผสมเด่น 3 ตัว (Niacinamide, Sodium Hyaluronate, Glycereth-26)
- กิจวัตร 4 ขั้นตอน, รีวิว 3 รายการ, สถิติ 98%, รูปก่อน-หลัง (slider ลากเทียบได้)
- หมายเหตุ: รูป Night Repair Cream ไม่มีบนเว็บเดิม → ใช้ placeholder สไตล์แบรนด์ชั่วคราว
