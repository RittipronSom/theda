import sharp from "sharp";

// เลื่อนเนื้อหาแบนเนอร์ไปทางขวา: ตัดโซน bokeh รกทางซ้าย (0-15%) และกิ่งดอกไม้ขอบขวา (82-100%)
// แล้วเติมผิวน้ำเรียบ mirror ทางซ้าย ให้ขวดสินค้าเลื่อนจาก 46-70% ไปอยู่ ~64-88%
// คงขนาด/สัดส่วนเดิม 3392x1248 ไม่กระทบการ crop ของ CSS

const SRC = "public/images/hero-banner-v2.png";
const OUT = "public/images/hero-banner-v2-right.jpg";

const W = 3392;
const H = 1248;
const L = 509;   // 15% — ตัดโซน bokeh/แสงวาบซ้ายทิ้ง
const R = 2781;  // 82% — ตัดกิ่งดอกไม้ขวา (โดนขอบภาพตัดอยู่แล้ว)
const PAD = W - (R - L); // 1120px ผิวน้ำเรียบทางซ้าย

// แผ่นเติมซ้าย: mirror ของ [L, L+PAD] ให้รอยต่อที่ x=L ต่อเนื่องกันเป็นธรรมชาติ (เหมือนภาพสะท้อนผิวน้ำ)
const pad = await sharp(SRC)
  .extract({ left: L, top: 0, width: PAD, height: H })
  .flop()
  .toBuffer();

const main = await sharp(SRC)
  .extract({ left: L, top: 0, width: R - L, height: H })
  .toBuffer();

await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 230, g: 240, b: 247 } },
})
  .composite([
    { input: pad, left: 0, top: 0 },
    { input: main, left: PAD, top: 0 },
  ])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`${OUT} done: ${meta.width}x${meta.height}`);
