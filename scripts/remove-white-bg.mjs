import sharp from "sharp";
import { renameSync } from "node:fs";

for (const name of ["deep-cream", "essence", "fluid-emulsion"]) {
  const path = `public/images/products/${name}.png`;
  const { data, info } = await sharp(path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  const T = 242;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const isWhite = r >= T && g >= T && b >= T;
    out[i] = r; out[i + 1] = g; out[i + 2] = b;
    out[i + 3] = isWhite ? 0 : 255;
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(`public/images/products/${name}-transparent.png`);
  console.log(name, "-> transparent png done");
}
