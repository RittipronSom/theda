import sharp from "sharp";
import { rmSync } from "node:fs";
for (const name of ["before", "after"]) {
  const buf = await sharp(`public/images/before-after/${name}.png`)
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  const { writeFileSync } = await import("node:fs");
  writeFileSync(`public/images/before-after/${name}.png`, buf);
}
rmSync("public/images/products/serum-hq.png");
console.log("shrunk");
