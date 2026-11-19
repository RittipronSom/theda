import { db } from "./client";
import {
  products,
  productIngredients,
  heroIngredients,
  routineSteps,
  testimonials,
} from "./schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Seeding THEDA database...");

  await db.run(sql`DROP TABLE IF EXISTS products`);
  await db.run(sql`DROP TABLE IF EXISTS product_ingredients`);
  await db.run(sql`DROP TABLE IF EXISTS hero_ingredients`);
  await db.run(sql`DROP TABLE IF EXISTS routine_steps`);
  await db.run(sql`DROP TABLE IF EXISTS testimonials`);
  await db.run(sql`DROP TABLE IF EXISTS users`);
  await db.run(sql`DROP TABLE IF EXISTS sessions`);
  await db.run(sql`DROP TABLE IF EXISTS orders`);
  await db.run(sql`DROP TABLE IF EXISTS order_items`);
  await db.run(sql`DROP TABLE IF EXISTS settings`);

  await db.run(sql`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      badge TEXT,
      size TEXT NOT NULL,
      price INTEGER NOT NULL,
      short_desc TEXT NOT NULL,
      long_desc TEXT NOT NULL,
      suitable_for TEXT NOT NULL,
      image TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);
  await db.run(sql`
    CREATE TABLE product_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      detail TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE hero_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      letter TEXT NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      tags TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE routine_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step_no INTEGER NOT NULL,
      title TEXT NOT NULL,
      product_slug TEXT NOT NULL,
      instruction TEXT NOT NULL,
      timing TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote TEXT NOT NULL,
      initial TEXT NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      location TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `);

  await db.insert(products).values([
    {
      slug: "hydro-matrix-deep-cream",
      name: "THEDA Hydro Matrix Deep Cream",
      badge: "BESTSELLER",
      size: "120ml",
      price: 890,
      shortDesc:
        "เทคโนโลยีไมโครบับเบิลผสานสารสกัดจากไข่มุก ทำความสะอาดอย่างล้ำลึก พร้อมคงความชุ่มชื้นตามธรรมชาติของผิว",
      longDesc:
        "Hydro Matrix Deep Cream คือนวัตกรรมบำรุงผิวขั้นสูงที่ผสานเทคโนโลยีไมโครบับเบิลเข้ากับสารสกัดจากไข่มุกธรรมชาติ ช่วยทำความสะอาดผิวอย่างล้ำลึกโดยไม่ทำลายเกราะป้องกันผิวตามธรรมชาติ เนื้อครีมเข้มข้นซึมซาบเร็ว มอบความชุ่มชื้นยาวนานตลอดวัน พร้อมกระชับรูขุมขนและลดเลือนริ้วรอยแห่งวัยให้ดูจางลงอย่างเห็นได้ชัด",
      suitableFor: "เหมาะสำหรับทุกสภาพผิว โดยเฉพาะผิวแห้งและผิวผสม",
      image: "/images/products/deep-cream.png",
      sortOrder: 1,
    },
    {
      slug: "hydro-matrix-activator-essence",
      name: "THEDA Hydro-Matrix Activator Essence",
      badge: "EDITOR'S PICK",
      size: "100ml",
      price: 390,
      shortDesc:
        "เอสเซนส์สูตรอ่อนโยน เนื้อบางเบา ผสานพลัง Sodium Hyaluronate ช่วยเติมเต็มความชุ่มชื้นอย่างล้ำลึก ฟื้นคืนความอิ่มเอิบ ลดความรู้สึกแห้งตึง",
      longDesc:
        "Hydro-Matrix Activator Essence เป็นเอสเซนส์เนื้อบางเบาที่เข้มข้นด้วย Sodium Hyaluronate ชนิดโมเลกุลเล็ก ที่สามารถซึมลึกเข้าสู่ชั้นผิวได้อย่างมีประสิทธิภาพ ช่วยฟื้นคืนความชุ่มชื้นที่สูญเสียไปจากสภาวะแวดล้อมและความเครียด ทำให้ผิวดูอิ่มเอิบ นุ่มนวล และเปล่งประกายจากภายใน",
      suitableFor: "เหมาะสำหรับทุกสภาพผิว โดยเฉพาะผิวขาดน้ำ",
      image: "/images/products/essence.png",
      sortOrder: 2,
    },
    {
      slug: "hydro-matrix-fluid-emulsion",
      name: "THEDA Hydro Matrix Fluid Emulsion",
      badge: "NEW",
      size: "150ml",
      price: 1090,
      shortDesc:
        "4D Hyaluronic Complex ผสาน Snow Mushroom เติมความชุ่มชื้นบางเบาที่ซึมลึกถึง 4 ชั้นผิว",
      longDesc:
        "Hydro Matrix Fluid Emulsion นำเสนอเทคโนโลยี 4D Hyaluronic Complex ที่ผสาน Hyaluronic Acid 4 ขนาดโมเลกุล พร้อมสารสกัด Snow Mushroom ธรรมชาติ ช่วยเติมความชุ่มชื้นได้ลึกถึง 4 ชั้นของผิวหนัง เนื้อเอมัลชันบางเบา ไม่เหนียวเหนอะหนะ เหมาะกับอากาศร้อนชื้น",
      suitableFor: "เหมาะสำหรับทุกสภาพผิว โดยเฉพาะผิวมันและผิวผสม",
      image: "/images/products/fluid-emulsion.png",
      sortOrder: 3,
    },
    {
      slug: "glow-serum",
      name: "THEDA Glow Serum",
      badge: "GLOW BOOST",
      size: "30ml",
      price: 199,
      shortDesc:
        "Niacinamide 10% ช่วยให้ผิวแลดูกระจ่างใส เปล่งประกาย พร้อมฟื้นบำรุงปราการปกป้องผิวให้แลดูสุขภาพดี เนื้อสัมผัสบางเบา ซึมไว",
      longDesc:
        "Glow Serum สูตรเข้มข้นด้วย Niacinamide 10% ช่วยปรับภาวะผิวให้แลดูกระจ่างใส ลดจุดด่างดำและรอยแดง ฟื้นบำรุงปราการปกป้องผิวให้แข็งแรง พร้อม Antioxidant จากวิตามิน C ธรรมชาติ ช่วยต้านอนุภาคอิสระและชะลอการเกิดริ้วรอย",
      suitableFor: "เหมาะสำหรับทุกสภาพผิว โดยเฉพาะผิวหมองคล้ำและมีรอยด่างดำ",
      image: "/images/products/serum.png",
      sortOrder: 4,
    },
    {
      slug: "night-repair-cream",
      name: "THEDA Night Repair Cream",
      badge: "OVERNIGHT MAGIC",
      size: "50ml",
      price: 1490,
      shortDesc:
        "Retinol + Ceramide + Centella ฟื้นฟูผิวขณะหลับใหล ตื่นมาพร้อมผิวที่ดูกระชับ เปล่งปลั่งขึ้นอย่างเห็นได้ชัด",
      longDesc:
        "Night Repair Cream นวัตกรรมฟื้นฟูผิวยามค่ำคืนด้วย Retinol encapsulated ที่อ่อนโยนต่อผิว ผสาน Ceramide และ Centella Asiatica ช่วยซ่อมแซมผิวขณะหลับใหล ลดเลือนริ้วรอย กระชับผิว และตื่นมาพร้อมผิวที่ดูอ่อนเยาว์ เปล่งปลั่งขึ้นอย่างเห็นได้ชัดในทุกเช้า",
      suitableFor: "เหมาะสำหรับทุกสภาพผิว โดยเฉพาะผิวมีริ้วรอยและผิวโทรม",
      image: "/images/products/night-repair.png",
      sortOrder: 5,
    },
  ]);

  await db.insert(productIngredients).values([
    {
      productSlug: "hydro-matrix-deep-cream",
      name: "Pearl Extract",
      detail: "สารสกัดจากไข่มุก ช่วยปรับผิวให้กระจ่างใส",
    },
    {
      productSlug: "hydro-matrix-deep-cream",
      name: "Micro-Bubble Technology",
      detail: "ฟองละเอียดทำความสะอาดล้ำลึก",
    },
    {
      productSlug: "hydro-matrix-deep-cream",
      name: "Hyaluronic Acid",
      detail: "เติมเต็มความชุ่มชื้นหลายชั้น",
    },
    {
      productSlug: "hydro-matrix-deep-cream",
      name: "Ceramide NP",
      detail: "ฟื้นฟูเกราะป้องกันผิว",
    },
    {
      productSlug: "hydro-matrix-activator-essence",
      name: "Sodium Hyaluronate",
      detail: "ไฮยาลูรอนิกขนาดโมเลกุลเล็ก ซึมลึกรวดเร็ว",
    },
    {
      productSlug: "hydro-matrix-activator-essence",
      name: "Panthenol (B5)",
      detail: "ฟื้นฟูและปลอบประโลมผิว",
    },
    {
      productSlug: "hydro-matrix-activator-essence",
      name: "Allantoin",
      detail: "ลดการระคายเคือง เสริมการสร้างเซลล์ใหม่",
    },
    {
      productSlug: "hydro-matrix-activator-essence",
      name: "Trehalose",
      detail: "คงความชุ่มชื้นในสภาวะแห้ง",
    },
    {
      productSlug: "hydro-matrix-fluid-emulsion",
      name: "4D Hyaluronic Complex",
      detail: "ไฮยาลูรอนิก 4 ขนาดโมเลกุล",
    },
    {
      productSlug: "hydro-matrix-fluid-emulsion",
      name: "Snow Mushroom Extract",
      detail: "เห็ดหิมะธรรมชาติ คงความชุ่มชื้น",
    },
    {
      productSlug: "hydro-matrix-fluid-emulsion",
      name: "Beta-Glucan",
      detail: "เสริมภูมิคุ้มกันผิว",
    },
    {
      productSlug: "hydro-matrix-fluid-emulsion",
      name: "Squalane",
      detail: "บำรุงผิวให้นุ่มลื่น",
    },
    {
      productSlug: "glow-serum",
      name: "Niacinamide 10%",
      detail: "ปรับภาวะผิวกระจ่างใส ลดรอยด่างดำ",
    },
    {
      productSlug: "glow-serum",
      name: "Vitamin C Derivative",
      detail: "ต้านอนุภาคอิสระ ชะลอริ้วรอย",
    },
    {
      productSlug: "glow-serum",
      name: "Alpha-Arbutin",
      detail: "ลดเม็ดสีเมลานิน",
    },
    {
      productSlug: "glow-serum",
      name: "Zinc PCA",
      detail: "ควบคุมความมัน กระชับรูขุมขน",
    },
    {
      productSlug: "night-repair-cream",
      name: "Encapsulated Retinol",
      detail: "เรตินอลอ่อนโยน ฟื้นฟูผิวยามค่ำคืน",
    },
    {
      productSlug: "night-repair-cream",
      name: "Ceramide Complex",
      detail: "เสริมเกราะป้องกันผิวหน้า",
    },
    {
      productSlug: "night-repair-cream",
      name: "Centella Asiatica",
      detail: "ลดการอักเสบ ปลอบประโลมผิว",
    },
    {
      productSlug: "night-repair-cream",
      name: "Peptide Complex",
      detail: "กระตุ้นคอลลาเจน ลดริ้วรอย",
    },
  ]);

  await db.insert(heroIngredients).values([
    {
      letter: "N",
      name: "Niacinamide",
      subtitle: "Vitamin B3 ความเข้มข้น 10%",
      description:
        "ช่วยให้ผิวแลดูกระจ่างใส สีผิวแลดูสม่ำเสมอเปล่งประกาย ช่วยลดความมันส่วนเกินซึ่งเป็นสาเหตุของการเกิดสิว ดูแลริ้วรอยให้แลดูจางลง ผิวจึงเรียบเนียน กระชับ",
      tags: "Brightening,Oil Control,Anti-aging",
    },
    {
      letter: "H",
      name: "Sodium Hyaluronate",
      subtitle: "Hyaluronic Acid ชนิดโมเลกุลเล็ก",
      description:
        "ช่วยเติมเต็มความชุ่มชื้นอย่างล้ำลึก ฟื้นคืนความอิ่มเอิบให้ผิว ลดความรู้สึกแห้งตึง กักเก็บความชุ่มชื้นให้ผิวดูอิ่มน้ำ และเพิ่มความสดใสอย่างเป็นธรรมชาติ",
      tags: "Deep Hydration,Plumping,Moisture Lock",
    },
    {
      letter: "G",
      name: "Glycereth-26",
      subtitle: "สารให้ความชุ่มชื้นจากธรรมชาติ",
      description:
        "มอยส์เจอไรเซอร์ประสิทธิภาพสูง ช่วยปกป้องผิวจากมลภาวะภายนอก เสริมสร้างปราการผิวให้แข็งแรง เนื้อสัมผัสบางเบา ไม่เหนียวเหนอะหนะ ซึมไว",
      tags: "Barrier Repair,Lightweight,Protection",
    },
  ]);

  await db.insert(routineSteps).values([
    {
      stepNo: 1,
      title: "ทำความสะอาด",
      productSlug: "hydro-matrix-deep-cream",
      instruction:
        "THEDA Hydro Matrix Deep Cream — นวดเบาๆ บนผิวหน้าที่เปียก ล้างออกด้วยน้ำอุ่น",
      timing: "เช้า & เย็น",
    },
    {
      stepNo: 2,
      title: "ปรับสมดุล",
      productSlug: "hydro-matrix-activator-essence",
      instruction:
        "THEDA Hydro-Matrix Activator Essence — ตบเบาๆ ทั่วใบหน้าและลำคอ รอให้ซึมเข้าผิว 30 วินาที",
      timing: "หลังทำความสะอาด",
    },
    {
      stepNo: 3,
      title: "บำรุงเข้มข้น",
      productSlug: "glow-serum",
      instruction:
        "THEDA Glow Serum — หยด 3 หยด กดเบาๆ ด้วยปลายนิ้ว รอ 1 นาทีให้ซึมเข้าผิว",
      timing: "ทุกเช้า",
    },
    {
      stepNo: 4,
      title: "ฟื้นบำรุง",
      productSlug: "hydro-matrix-fluid-emulsion",
      instruction:
        "THEDA Hydro Matrix Fluid Emulsion — ทาเป็นขั้นตอนสุดท้าย ล็อกความชุ่มชื้นตลอดคืน",
      timing: "เฉพาะก่อนนอน",
    },
  ]);

  await db.insert(testimonials).values([
    {
      quote:
        "ใช้ Glow Serum มาสองสัปดาห์ ผิวดูสว่างขึ้น รอยด่างดำจางลง แต่งหน้าติดทนขึ้นด้วย ราคานี้คุ้มมาก",
      initial: "ว",
      name: "วรัทยา ส.",
      age: 32,
      location: "กรุงเทพฯ",
      sortOrder: 1,
    },
    {
      quote:
        "เคยลองแบรนด์แพงมาหลายตัว แต่ THEDA คือถูกใจสุด เนื้อเบา ซึมไว ไม่เหนอะหน้า ตอนเช้ารีบๆ ก็ใช้ได้สบาย",
      initial: "ณ",
      name: "ณัฐชา พ.",
      age: 28,
      location: "นนทบุรี",
      sortOrder: 2,
    },
    {
      quote:
        "Night Repair Cream ดีจริงๆ ตื่นมาหน้านุ่ม ไม่โทรมเหมือนเมื่อก่อน แฟนยังทักว่าผิวดูดีขึ้น จะซื้อซ้ำแน่นอน",
      initial: "ส",
      name: "สุภาพร ก.",
      age: 35,
      location: "เชียงใหม่",
      sortOrder: 3,
    },
  ]);

  console.log("Seed complete ✓");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
