import sharp from "sharp";
import { renameSync, writeFileSync, readFileSync } from "node:fs";

for (const name of ["deep-cream", "essence", "fluid-emulsion"]) {
  const src = `public/images/products/${name}.png`;
  const dst = `public/images/products/${name}-t.png`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const L = 0.299 * r + 0.587 * g + 0.114 * b;
    let a;
    if (L >= 250) a = 0;
    else if (L <= 236) a = 255;
    else a = Math.round(((250 - L) / 14) * 255);
    out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = a;
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(dst);
  console.log(name, "feathered ->", dst);
}

// swap into main filenames (fallback: keep -t files if locked)
for (const name of ["deep-cream", "essence", "fluid-emulsion"]) {
  const main = `public/images/products/${name}.png`;
  const t = `public/images/products/${name}-t.png`;
  const buf = readFileSync(t);
  try {
    writeFileSync(main, buf);
    console.log(name, "swapped into main file");
  } catch (e) {
    console.log(name, "LOCKED, keeping -t file:", e.code);
  }
}
