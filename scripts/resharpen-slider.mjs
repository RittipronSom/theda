import sharp from "sharp";
for (const name of ["before", "after"]) {
  await sharp(`public/images/before-after/${name}.png`)
    .resize({ width: 1280, kernel: "lanczos3" })
    .sharpen({ sigma: 1.6, x1: 3, y2: 12, y3: 18, m1: 2.2, m2: 1.4 })
    .modulate({ brightness: 1.02, saturation: 1.07 })
    .linear(1.06, -6)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(`public/images/before-after/${name}-v2.png`);
  console.log(name, "-> v2 done");
}
