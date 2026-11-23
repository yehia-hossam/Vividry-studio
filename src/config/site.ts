/** All marketing copy lives here — edit text, links and sections without touching components. */
export interface NavLink { label: string; action?: "gallery" | "list"; href?: string }

export const site = {
  name: "Vividry",
  title: "Vividry — Neon Dusk Art Prints",
  description: "Bold, joyful art prints from independent artists. Walk the 3D gallery, find your colour, hang it tomorrow.",
  url: "https://example.com",

  hero: {
    kicker: "You are walking past",
    headline: "NEON DUSK",
    enter: "Enter the collection",
    skip: "Skip to shop",
    hintWalk: ["Scroll or drag to walk round", "Click a painting to look closer"],
    hintFocus: ["Click the painting to open it", "Esc or click away to step back"],
  },

  nav: [
    { label: "Index", action: "gallery" },
    { label: "Shop", action: "list" },
    { label: "Featured", href: "#featured" },
    { label: "Our story", href: "#story" },
    { label: "Reviews", href: "#reviews" },
    { label: "Help", href: "#faq" },
  ] as NavLink[],

  marquee: ["Free shipping over $100", "Printed to order", "Archival inks", "30-day returns", "Independent artists"],

  featured: {
    title: "Fresh off the press",
    text: "Four prints our visitors keep walking back to.",
    cta: "See all nine prints",
    ids: ["solar-arches", "neon-blossom", "wave-runner", "dusk-stripes"],
  },

  features: [
    { title: "Archival giclée", text: "Pigment inks on museum-grade paper that stays bright for 100+ years.", color: "var(--accent-2)", icon: "drop" },
    { title: "Made to order", text: "Every print is made after you order, so nothing sits in a warehouse.", color: "var(--accent)", icon: "spark" },
    { title: "Fast, free delivery", text: "Rolled in a tube and on its way in 3–5 days. Free over $100.", color: "var(--accent-3)", icon: "box" },
    { title: "Love it or return it", text: "30 days to return any unframed print, no questions asked.", color: "var(--accent-4)", icon: "heart" },
  ] as { title: string; text: string; color: string; icon: "drop" | "spark" | "box" | "heart" }[],

  story: {
    title: "Colour is the whole point.",
    text: [
      "Vividry started in a tiny studio with one belief: a wall should make you smile before you've had coffee.",
      "We commission independent artists, print every piece ourselves, and ship it with the care we'd want for our own home.",
    ],
    cta: "Meet the prints",
    stats: [
      { value: "42", label: "independent artists" },
      { value: "18k", label: "prints shipped" },
      { value: "4.9", label: "average rating" },
    ],
  },

  reviews: {
    title: "Walls that got happier",
    items: [
      { quote: "The colours are even better than the photos. My hallway finally has a personality.", name: "Salma R.", place: "Cairo" },
      { quote: "Packaging was perfect and the print quality is unreal. Ordering a second one already.", name: "Daniel K.", place: "Berlin" },
      { quote: "The 3D gallery made choosing fun. I knew which print was mine the second I walked past it.", name: "Aiko T.", place: "Osaka" },
    ],
  },

  faq: {
    title: "Questions, answered",
    items: [
      { q: "How long does delivery take?", a: "Unframed prints ship in 3–5 working days. Framed pieces take 7–10. You'll get tracking by email as soon as it leaves us." },
      { q: "Can I return a print?", a: "Yes — unframed prints can be returned within 30 days in their original tube. Signed editions are final sale." },
      { q: "What paper do you use?", a: "Art Paper (200 gsm matte), Fine Art Paper (310 gsm cotton rag) or Recycled Paper (100% post-consumer)." },
      { q: "Do you ship worldwide?", a: "We ship to 40+ countries. Shipping is calculated at checkout and is free on orders over $100." },
      { q: "Can I order custom sizes or wholesale?", a: "Absolutely. Email hello@vividry.example and we'll send a quote within one working day." },
    ],
  },

  newsletter: {
    title: "Get first look at every drop",
    text: "One email a month. New prints, artist stories and 10% off your first order.",
    placeholder: "you@example.com",
    button: "Join the list",
    success: "You're in! Check your inbox for your 10% code.",
  },

  footer: {
    blurb: "Joyful art prints from independent artists, made to order and shipped worldwide.",
    columns: [
      { title: "Shop", links: [{ label: "All prints", action: "list" }, { label: "Featured", href: "#featured" }, { label: "Gallery", action: "gallery" }] },
      { title: "Company", links: [{ label: "Our story", href: "#story" }, { label: "Reviews", href: "#reviews" }, { label: "Careers", href: "mailto:hello@vividry.example" }] },
      { title: "Help", links: [{ label: "FAQ", href: "#faq" }, { label: "Shipping", href: "#faq" }, { label: "Contact", href: "mailto:hello@vividry.example" }] },
    ] as { title: string; links: NavLink[] }[],
    socials: [
      { label: "Instagram", href: "#" },
      { label: "Pinterest", href: "#" },
      { label: "TikTok", href: "#" },
    ],
    legal: "© 2026 Yehia Dev. All rights reserved.",
  },
};
