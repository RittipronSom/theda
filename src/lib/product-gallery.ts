export type ProductGalleryImage = {
  src: string;
  alt: string;
};

const galleryFolders: Record<string, string> = {
  "hydro-matrix-deep-cream": "deep-cream",
  "glow-serum": "glow-serum",
  "hydro-matrix-fluid-emulsion": "fluid-emulsion",
  "hydro-matrix-activator-essence": "essence",
};

export function getProductGallery(slug: string, name: string): ProductGalleryImage[] {
  const folder = galleryFolders[slug];
  if (!folder) return [];
  return ["แนะนำสินค้าและคุณประโยชน์", "ส่วนผสมสำคัญ", "ภาพผลิตภัณฑ์"].map((label, index) => ({
    src: `/images/products/details/${folder}/${index + 1}.png`,
    alt: `${name} — ${label}`,
  }));
}
