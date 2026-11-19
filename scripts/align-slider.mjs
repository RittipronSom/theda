import sharp from "sharp";

// crop ทั้งสองภาพเป็น 1:1 จากตำแหน่งศูนย์กลางเดียวกัน + ชาร์ปเพนใหม่
// ให้สัดส่วน/สเกล/มุมตรงกันเป๊ะเวลาเทียบใน slider
for (const name of ["before", "after"]) {
  await sharp(`public/images/before-after/${name}-v2.png`)
    .resize(1280, 1280, { fit: "cover", position: "centre", kernel: "lanczos3" })
    .sharpen({ sigma: 1.8, x1: 4, y2: 14, y3: 20, m1: 2.6, m2: 1.6 })
    .modulate({ brightness: 1.03, saturation: 1.08 })
    .linear(1.07, -8)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(`public/images/before-after/${name}-v3.png`);
  const m = await sharp(`public/images/before-after/${name}-v3.png`).metadata();
  console.log(name, "->", `${m.width}x${m.height}`);
}
