/**
 * Product catalogue. Replace the demo entries with your own prints.
 * `image` can be a local file in /public or any CORS-enabled URL.
 * Ideal artwork ratio is 800 × 1080 (portrait, ≈ 1 : 1.35).
 */
export interface Product {
  id: string;
  title: string;
  artist: string;
  year: number;
  price: number;
  image: string;
  description: string;
  tag?: string;
}

const finish = " Giclée-printed on archival paper with vivid, fade-resistant inks.";

export const products: Product[] = [
  { id: "solar-arches", title: "Solar Arches", artist: "Mira Okafor", year: 2025, price: 64, image: "/art/solar-arches.svg", tag: "Bestseller", description: "Stacked arches glowing in candy pink, indigo and mint under a lemon sun." + finish },
  { id: "wave-runner", title: "Wave Runner", artist: "Leo Vasquez", year: 2025, price: 58, image: "/art/wave-runner.svg", tag: "New", description: "Ten rolling bands of colour that look like a coastline at full volume." + finish },
  { id: "pop-orbit", title: "Pop Orbit", artist: "Hana Sato", year: 2024, price: 60, image: "/art/pop-orbit.svg", description: "A pink planet circled by three ink rings on a bright mint sky." + finish },
  { id: "neon-blossom", title: "Neon Blossom", artist: "Zara Ellison", year: 2025, price: 66, image: "/art/neon-blossom.svg", tag: "Bestseller", description: "Ten petals in pink and sunshine yellow blooming against electric blue." + finish },
  { id: "terrazzo-dream", title: "Terrazzo Dream", artist: "Kofi Mensah", year: 2024, price: 52, image: "/art/terrazzo-dream.svg", description: "Confetti shapes scattered across blush pink, like a sunlit terrazzo floor." + finish },
  { id: "dusk-stripes", title: "Dusk Stripes", artist: "Ivy Lindholm", year: 2025, price: 62, image: "/art/dusk-stripes.svg", tag: "New", description: "A lemon sun sinking behind a field of widening evening stripes." + finish },
  { id: "checker-moon", title: "Checker Moon", artist: "Ravi Anand", year: 2024, price: 56, image: "/art/checker-moon.svg", description: "A cream moon over a pink-and-yellow checkerboard under a midnight sky." + finish },
  { id: "mountain-pop", title: "Mountain Pop", artist: "Noor Haddad", year: 2025, price: 60, image: "/art/mountain-pop.svg", description: "Overlapping peaks in indigo, ink and mint beneath a coral sun." + finish },
  { id: "bubble-pour", title: "Bubble Pour", artist: "Tess Marlowe", year: 2024, price: 54, image: "/art/bubble-pour.svg", description: "Translucent bubbles tumbling over warm orange, ringed in white." + finish },
];

export interface Option { label: string; delta: number }
export interface FrameOption extends Option { style: "none" | "classic" | "canvas" }

/** Options on the product page. `delta` is added to the base price. */
export const productOptions: {
  paper: Option[]; size: Option[]; signature: Option[]; frame: FrameOption[];
  accordion: { title: string; body: string }[];
} = {
  paper: [
    { label: "Art Paper", delta: 0 },
    { label: "Fine Art Paper", delta: 12 },
    { label: "Recycled Paper", delta: 4 },
  ],
  size: [
    { label: '11.7 × 16.5" (A3)', delta: 0 },
    { label: '16.5 × 23.4" (A2)', delta: 22 },
    { label: '23.4 × 33.1" (A1)', delta: 48 },
    { label: '33.1 × 46.8" (A0)', delta: 90 },
  ],
  signature: [
    { label: "Unsigned", delta: 0 },
    { label: "Signed and Numbered", delta: 18 },
  ],
  frame: [
    { label: "Unframed", delta: 0, style: "none" },
    { label: "Classic Frame", delta: 32, style: "classic" },
    { label: "Framed Canvas", delta: 54, style: "canvas" },
  ],
  accordion: [
    { title: "Paper & Sizes", body: "Art Paper is a smooth 200 gsm matte stock. Fine Art Paper is a 310 gsm cotton rag with a soft texture. Recycled Paper is 100% post-consumer fibre." },
    { title: "Delivery Info", body: "Prints are made to order and ship rolled in a tube within 3–5 working days. Framed pieces ship flat within 7–10 working days." },
    { title: "Returns Policy", body: "Unframed prints can be returned within 30 days in their original tube. Signed editions are final sale." },
  ],
};
