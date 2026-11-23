# Vividry — 3D Gallery Storefront Template

An immersive art-print storefront built with **Next.js 14 (App Router) · React 18 · TypeScript · three.js**.
Visitors walk a curved 3D gallery by scrolling or dragging, click a print to glide up to it, click again to open the
product page, and check out through a slide-in bag. Below the gallery sits a full landing page (featured prints,
features, story, reviews, FAQ, newsletter, footer).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Requires Node 18.17+. Fonts (Oswald, Fraunces, DM Mono) are loaded with `next/font/google` — no manual setup.

## Customise in 5 minutes

| I want to change…              | Edit                                   |
| ------------------------------ | -------------------------------------- |
| Brand name, copy, nav, FAQ…    | `src/config/site.ts`                   |
| Prints, prices, paper/size/frame options | `src/config/products.ts`     |
| Colours (UI **and** 3D room)   | `src/config/theme.ts`                  |
| Artwork                        | drop files in `public/art/` and update `image` in `products.ts` |
| Section order / remove a section | `src/app/page.tsx`                   |
| Page title, SEO, fonts         | `src/app/layout.tsx`                   |

**Artwork:** portrait images, ideally 800 × 1080 px (ratio ≈ 1 : 1.35), JPG / PNG / WebP / SVG.
Remote URLs work if the server sends `Access-Control-Allow-Origin` (needed by WebGL).
`npm run art` regenerates the demo SVG artworks.

**Number of prints:** any amount works — the gallery repeats them around the ring (36 on the outer wall, 24 on the inner).

## Project structure

```
src/
  app/                 layout, page composition, global + component CSS
  config/              site copy, products, theme  ← the only files most buyers edit
  components/
    gallery/           GalleryHero (sticky 3D stage + overlay UI + entrance animation)
    layout/            Header, Footer
    sections/          Marquee, Featured, Features, Story, Reviews, Faq, Newsletter
    shop/              ProductPage, ProductList, ProductCard, BagDrawer
    providers/         StoreProvider (view state + bag, persisted in localStorage)
    ui/                Accordion, Reveal, ArtImage, Icons
  hooks/               useMedia, useInView
  lib/gallery/         three.js engine (GalleryEngine, poses, textures, constants)
```

## How the gallery works

* `GalleryEngine` is a plain class — React only creates it and forwards events. The room never moves; only the camera travels along the ring.
* The hero is `position: sticky` inside a 400svh track, so **page scroll drives the walk** and the sections below follow naturally. A “Skip to shop” button jumps past it.
* Clicking a print glides the camera (0.95 s, per-axis easing). Clicking the focused print opens the product page with a fly-in animation of the artwork.
* Everything uses unlit `MeshBasicMaterial` with gradient textures, so it is light on the GPU. Rendering pauses when the hero is off-screen or covered.
* `prefers-reduced-motion` disables CSS animation and makes camera moves instant. If WebGL is unavailable the page still works without the 3D room.

## Responsive system

Two CSS units drive the layout: `--u` (gallery UI) and `--w` (product page, list, drawer), both designed on a 1440 × 900 frame.
On small screens (phones, portrait tablets, landscape phones) both become `1px` and a dedicated layout takes over.
The media query is duplicated in CSS and in `lib/gallery/constants.ts` (`SMALL_QUERY`) — change both together.
Text never drops below 11 px and tap targets are at least 24 px.

## Going live

* **Checkout:** `BagDrawer.tsx` → the Checkout button currently shows an alert. Connect Stripe Checkout, Shopify Storefront API, Snipcart, etc.
* **Newsletter:** `Newsletter.tsx` → replace the `subscribe()` stub with your provider or an API route.
* **Cart persistence:** the bag is stored in `localStorage` (`StoreProvider.tsx`); swap for server state if needed.
* **SEO:** set `site.url` in `config/site.ts`; add an `opengraph-image` in `src/app/`.

## Deploy

Works out of the box on Vercel, Netlify, or any Node host (`npm run build && npm start`).

---

## بالعربي (ملخص سريع)

1. `npm install` ثم `npm run dev`.
2. غيّر النصوص من `src/config/site.ts`، والمنتجات والأسعار من `src/config/products.ts`، والألوان من `src/config/theme.ts`.
3. حط صورك في `public/art/` (مقاس مثالي 800×1080) وعدّل مسارها في `products.ts` — المعرض ثلاثي الأبعاد يتحدّث تلقائيًا.
4. ربط الدفع من `BagDrawer.tsx`، وربط النشرة البريدية من `Newsletter.tsx`.
5. للنشر: ارفع المشروع على Vercel أو أي استضافة Node.

## License

Provided as a commercial template: use it for unlimited client or personal projects; do not resell the template itself as-is.
# Vividry-studio
