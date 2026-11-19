import sharp from "sharp";

// 1) hero background: after.png → 2560w, sharpen, brighter → hero-bg.jpg
await sharp("public/images/before-after/after.png")
  .resize({ width: 2560, kernel: "lanczos3" })
  .sharpen({ sigma: 1.4, m1: 1.2, m2: 0.6 })
  .modulate({ brightness: 1.04, saturation: 1.05 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/images/hero-bg.jpg");
console.log("hero-bg.jpg done");

// 2) before/after slider: upscale to 2048 + sharpen
for (const name of ["before", "after"]) {
  await sharp(`public/images/before-after/${name}.png`)
    .resize({ width: 2048, kernel: "lanczos3" })
    .sharpen({ sigma: 1.2 })
    .png({ compressionLevel: 9 })
    .toFile(`public/images/before-after/${name}-2x.png`);
  console.log(`${name}-2x.png done`);
}

// 3) product photos: sharpen + re-encode (crisp at display size)
for (const name of ["deep-cream", "essence", "fluid-emulsion"]) {
  await sharp(`public/images/products/${name}.png`)
    .sharpen({ sigma: 1.1, m1: 1.0, m2: 0.5 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(`public/images/products/${name}-hq.jpg`);
  console.log(`${name}-hq.jpg done`);
}

// 4) serum (transparent PNG): mild sharpen, keep alpha
await sharp("public/images/products/serum.png")
  .resize({ width: 1200, kernel: "lanczos3" })
  .sharpen({ sigma: 0.9 })
  .png({ compressionLevel: 9 })
  .toFile("public/images/products/serum-hq.png");
console.log("serum-hq.png done");
