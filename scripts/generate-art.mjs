/**
 * Generates the nine demo artworks (public/art/*.svg).
 * Run `npm run art` to regenerate. Replace them with your own JPG/PNG/WebP files
 * and update `image` in src/config/products.ts — the 3D gallery adapts automatically.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const W = 800, H = 1080;
const INK = "#1B1340", PINK = "#FF4F7B", SUN = "#FFC93C", MINT = "#22D3A6", BLUE = "#4F46FF", ORANGE = "#FF8A3D", BLUSH = "#FFE3EC";

const wrap = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1620" viewBox="0 0 ${W} ${H}">${body}</svg>`;
const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

const arts = {
  "solar-arches": () => {
    const cols = [PINK, BLUE, MINT, INK];
    let out = `<rect width="${W}" height="${H}" fill="${SUN}"/><circle cx="400" cy="210" r="86" fill="${ORANGE}"/>`;
    cols.forEach((c, i) => {
      const w = 640 - i * 130, top = 300 + i * 90, r = w / 2, x1 = 400 - r, x2 = 400 + r;
      out += `<path d="M${x1} 940 V${top + r} A${r} ${r} 0 0 1 ${x2} ${top + r} V940 Z" fill="${c}"/>`;
    });
    return out + `<rect y="940" width="${W}" height="140" fill="${INK}"/>`;
  },
  "wave-runner": () => {
    const cols = [PINK, SUN, MINT, BLUE, ORANGE];
    let out = `<rect width="${W}" height="${H}" fill="${INK}"/>`;
    for (let i = 0; i < 10; i++) {
      const base = 130 + i * 92; let d = `M0 ${H} L0 ${base}`;
      for (let x = 0; x <= W; x += 16) d += ` L${x} ${(base + 38 * Math.sin(x / 62 + i * 1.3)).toFixed(1)}`;
      out += `<path d="${d} L${W} ${H} Z" fill="${cols[i % cols.length]}"/>`;
    }
    return out;
  },
  "pop-orbit": () => {
    let out = `<rect width="${W}" height="${H}" fill="${MINT}"/><circle cx="400" cy="470" r="230" fill="#fff"/>`;
    [0, 60, 120].forEach((a) => (out += `<ellipse cx="400" cy="470" rx="330" ry="110" fill="none" stroke="${INK}" stroke-width="10" transform="rotate(${a} 400 470)"/>`));
    out += `<circle cx="400" cy="470" r="110" fill="${PINK}"/><circle cx="640" cy="330" r="34" fill="${SUN}"/><circle cx="150" cy="620" r="26" fill="${BLUE}"/><circle cx="560" cy="700" r="18" fill="${INK}"/>`;
    return out + `<path d="M0 ${H} V860 Q200 780 400 860 T800 860 V${H} Z" fill="${INK}"/>`;
  },
  "neon-blossom": () => {
    let out = `<rect width="${W}" height="${H}" fill="${BLUE}"/>`;
    for (let i = 0; i < 10; i++) out += `<ellipse cx="400" cy="270" rx="66" ry="190" fill="${i % 2 ? SUN : PINK}" opacity=".92" transform="rotate(${i * 36} 400 460)"/>`;
    out += `<circle cx="400" cy="460" r="74" fill="#fff"/><circle cx="400" cy="460" r="32" fill="${INK}"/>`;
    return out + `<rect x="392" y="700" width="16" height="380" fill="${MINT}"/><path d="M400 900 Q300 840 250 880 Q320 940 400 900Z" fill="${MINT}"/>`;
  },
  "terrazzo-dream": () => {
    const r = rng(7), cols = [PINK, SUN, MINT, BLUE, INK, ORANGE];
    let out = `<rect width="${W}" height="${H}" fill="${BLUSH}"/>`;
    for (let i = 0; i < 46; i++) {
      const x = r() * W, y = r() * H, s = 30 + r() * 80, c = cols[Math.floor(r() * cols.length)], rot = Math.floor(r() * 360), k = Math.floor(r() * 3);
      out += k === 0 ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(s / 2).toFixed(0)}" fill="${c}"/>`
        : k === 1 ? `<rect x="${(x - s / 2).toFixed(0)}" y="${(y - s / 4).toFixed(0)}" width="${s.toFixed(0)}" height="${(s / 2).toFixed(0)}" rx="${(s / 4).toFixed(0)}" fill="${c}" transform="rotate(${rot} ${x.toFixed(0)} ${y.toFixed(0)})"/>`
        : `<polygon points="${x.toFixed(0)},${(y - s / 2).toFixed(0)} ${(x + s / 2).toFixed(0)},${(y + s / 2).toFixed(0)} ${(x - s / 2).toFixed(0)},${(y + s / 2).toFixed(0)}" fill="${c}" transform="rotate(${rot} ${x.toFixed(0)} ${y.toFixed(0)})"/>`;
    }
    return out;
  },
  "dusk-stripes": () => {
    let out = `<rect width="${W}" height="${H}" fill="${PINK}"/><circle cx="400" cy="600" r="250" fill="${SUN}"/><rect y="600" width="${W}" height="480" fill="${INK}"/>`;
    for (let i = 0; i < 8; i++) out += `<rect y="${600 + i * 60 + i * i * 2}" width="${W}" height="${6 + i * 3}" fill="${[PINK, ORANGE, SUN][i % 3]}"/>`;
    return out;
  },
  "checker-moon": () => {
    let out = `<rect width="${W}" height="${H}" fill="${INK}"/>`;
    const r = rng(11);
    for (let i = 0; i < 40; i++) out += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * 560).toFixed(0)}" r="${(1 + r() * 3).toFixed(1)}" fill="#fff" opacity=".8"/>`;
    out += `<circle cx="400" cy="330" r="190" fill="#FFF4D6"/><circle cx="340" cy="290" r="34" fill="#F4DFA8"/><circle cx="470" cy="400" r="46" fill="#F4DFA8"/><circle cx="450" cy="250" r="18" fill="#F4DFA8"/>`;
    for (let y = 0; y < 6; y++) for (let x = 0; x < 10; x++) out += `<rect x="${x * 80}" y="${640 + y * 74}" width="80" height="74" fill="${(x + y) % 2 ? SUN : PINK}"/>`;
    return out;
  },
  "mountain-pop": () => {
    let out = `<rect width="${W}" height="${H}" fill="${SUN}"/><circle cx="400" cy="330" r="160" fill="${PINK}"/>`;
    out += `<polygon points="-40,900 260,420 560,900" fill="${BLUE}"/><polygon points="240,900 540,380 840,900" fill="${INK}"/><polygon points="-40,1080 220,640 480,1080" fill="${MINT}"/><polygon points="360,1080 620,700 880,1080" fill="${ORANGE}"/>`;
    return out;
  },
  "bubble-pour": () => {
    const r = rng(23), cols = [PINK, SUN, MINT, BLUE, "#fff", INK];
    let out = `<rect width="${W}" height="${H}" fill="${ORANGE}"/>`;
    for (let i = 0; i < 22; i++) out += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * H).toFixed(0)}" r="${(40 + r() * 130).toFixed(0)}" fill="${cols[i % cols.length]}" opacity=".82"/>`;
    return out + `<circle cx="400" cy="540" r="250" fill="none" stroke="#fff" stroke-width="14"/>`;
  },
};

mkdirSync("public/art", { recursive: true });
for (const [name, fn] of Object.entries(arts)) writeFileSync(`public/art/${name}.svg`, wrap(fn()));
console.log(`Generated ${Object.keys(arts).length} artworks in public/art`);
