import sharp from "sharp";
const files = [
  "public/images/products/serum.png",
  "public/images/products/deep-cream.png",
  "public/images/products/essence.png",
  "public/images/products/fluid-emulsion.png",
  "public/images/logo.png",
];
for (const f of files) {
  const img = sharp(f);
  const meta = await img.metadata();
  const stats = await img.stats();
  const d = stats.dominant;
  const hex = (c) => "#" + [c.r, c.g, c.b].map((x) => x.toString(16).padStart(2, "0")).join("");
  const means = stats.channels.map((c) => Math.round(c.mean));
  console.log(f, `${meta.width}x${meta.height} ${meta.format}`, "dominant:", hex(d), "rgb-mean:", means.join(","));
}
