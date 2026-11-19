import sharp from "sharp";

// Night Repair Cream — brand-style product render (dark jar, rose-gold lid)
const W = 800, H = 800;
const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="jar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2A161C"/>
      <stop offset="0.5" stop-color="#4A2B34"/>
      <stop offset="1" stop-color="#1F0F14"/>
    </linearGradient>
    <linearGradient id="lid" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9A6A64"/>
      <stop offset="0.5" stop-color="#E2B5AD"/>
      <stop offset="1" stop-color="#8A5A56"/>
    </linearGradient>
    <linearGradient id="label" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F6ECE8"/>
      <stop offset="1" stop-color="#E8D5CF"/>
    </linearGradient>
  </defs>

  <!-- jar body -->
  <rect x="200" y="300" width="400" height="360" rx="46" fill="url(#jar)"/>
  <!-- jar highlight -->
  <rect x="232" y="330" width="26" height="290" rx="13" fill="#FFFFFF" opacity="0.10"/>

  <!-- label band -->
  <rect x="200" y="392" width="400" height="176" fill="url(#label)" opacity="0.96"/>
  <text x="400" y="448" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="44" letter-spacing="14" fill="#3B2228">THEDA</text>
  <line x1="330" y1="466" x2="470" y2="466" stroke="#C08886" stroke-width="2"/>
  <text x="400" y="500" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="26" fill="#6B4A50">Night Repair</text>
  <text x="400" y="532" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="6" fill="#8A6B6C">CREAM · 50ml</text>

  <!-- lid -->
  <rect x="228" y="216" width="344" height="96" rx="26" fill="url(#lid)"/>
  <rect x="228" y="292" width="344" height="22" fill="#00000022"/>
  <!-- lid highlight -->
  <rect x="252" y="228" width="20" height="60" rx="10" fill="#FFFFFF" opacity="0.35"/>

  <!-- soft shadow -->
  <ellipse cx="400" cy="688" rx="210" ry="26" fill="#3B2228" opacity="0.18"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/images/products/night-repair.png");
console.log("night-repair.png created");
