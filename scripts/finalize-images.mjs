import sharp from "sharp";
import { renameSync, rmSync } from "node:fs";

// serum: sharpen at 800w (display max ~340px), keep transparency, reasonable size
await sharp("public/images/products/serum.png")
  .resize({ width: 800, kernel: "lanczos3" })
  .sharpen({ sigma: 0.9 })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile("public/images/products/serum-new.png");

// overwrite originals with enhanced versions
renameSync("public/images/products/deep-cream-hq.jpg", "public/images/products/deep-cream.png");
renameSync("public/images/products/essence-hq.jpg", "public/images/products/essence.png");
renameSync("public/images/products/fluid-emulsion-hq.jpg", "public/images/products/fluid-emulsion.png");
renameSync("public/images/before-after/before-2x.png", "public/images/before-after/before.png");
renameSync("public/images/before-after/after-2x.png", "public/images/before-after/after.png");
renameSync("public/images/products/serum-new.png", "public/images/products/serum.png");
console.log("finalized");
