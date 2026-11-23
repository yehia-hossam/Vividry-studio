"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { products } from "@/config/products";
import { site } from "@/config/site";
import { theme } from "@/config/theme";
import { GalleryEngine } from "@/lib/gallery/GalleryEngine";
import { SMALL_QUERY, WHEEL_RATE } from "@/lib/gallery/constants";
import { useReducedMotion } from "@/hooks/useMedia";
import { useStore } from "@/components/providers/StoreProvider";
import { ArrowDown, ArrowLeft, ArrowRight } from "@/components/ui/Icons";

const TRACK_SCREENS = 4; // how many screens of scrolling equal one walk round the ring

/** A line of text inside an overflow-hidden mask so it can rise into view on load. */
const Line = ({ children }: { children: React.ReactNode }) => (
  <span className="mask"><span data-intro="line">{children}</span></span>
);

export default function GalleryHero() {
  const store = useStore();
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GalleryEngine | null>(null);
  const [focused, setFocused] = useState(false);

  // Latest store actions without re-creating the engine.
  const storeRef = useRef(store);
  storeRef.current = store;

  const showPill = useCallback((x: number, y: number, on: boolean) => {
    const el = pillRef.current;
    if (!el) return;
    el.style.opacity = on ? "1" : "0";
    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }, []);

  /* ---- create the engine once ---- */
  useEffect(() => {
    const stage = stageRef.current!;
    const cs = getComputedStyle(document.body);
    const fonts = {
      serif: cs.getPropertyValue("--font-serif").trim() || "Georgia, serif",
      mono: cs.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace",
    };
    let cancelled = false;
    let engine: GalleryEngine;
    try {
      engine = new GalleryEngine({
        container: stage,
        products,
        theme: theme.scene,
        fonts,
        reducedMotion: reduced,
        callbacks: {
          onFocusChange: (idx, settled) => {
            setFocused(idx !== null);
            if (idx === null) showPill(0, 0, false);
            else if (settled && window.matchMedia(SMALL_QUERY).matches) {
              const r = engineRef.current?.getFocusRect();
              if (r) showPill(r.left + r.width / 2, r.top + r.height * 0.55, true);
            }
          },
          onOpen: (idx) => {
            showPill(0, 0, false);
            storeRef.current.openProduct(idx, engineRef.current?.getFocusRect() ?? null, "gallery");
          },
          onHover: (over, x, y) => showPill(x, y, over),
        },
      });
    } catch (err) {
      // WebGL unavailable: show the page content without the 3D room.
      console.warn("3D gallery disabled:", err);
      document.documentElement.classList.remove("intro-pending");
      if (veilRef.current) veilRef.current.style.display = "none";
      return;
    }
    engineRef.current = engine;

    const runIntro = () => {
      if (cancelled) return;
      const html = document.documentElement;
      const lines = [...document.querySelectorAll<HTMLElement>('[data-intro="line"]')];
      const nav = [...document.querySelectorAll<HTMLElement>('[data-intro="nav"]')];
      html.classList.remove("intro-pending");
      if (!reduced) {
        [...lines, ...nav].forEach((el, i) => {
          const frames = el.dataset.intro === "line"
            ? [{ transform: "translateY(105%)" }, { transform: "translateY(0)" }]
            : [{ opacity: 0 }, { opacity: 1 }];
          el.animate(frames, { delay: 250 + i * 60, duration: 1000, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
        });
        veilRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: "ease-out", fill: "forwards" })
          .finished.then(() => { if (veilRef.current) veilRef.current.style.display = "none"; }).catch(() => undefined);
      } else if (veilRef.current) veilRef.current.style.display = "none";
      engine.startIntro();
    };

    // Start once art + fonts are ready, or after 4 s regardless.
    const failsafe = window.setTimeout(runIntro, 4000);
    engine.init().then(() => document.fonts.ready).then(() => { window.clearTimeout(failsafe); runIntro(); });

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      engine.dispose();
      engineRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- page scroll drives the walk (and leaving the hero pauses rendering) ---- */
  useEffect(() => {
    const track = trackRef.current!;
    let lastY = window.scrollY;
    const onScroll = () => {
      const e = engineRef.current;
      if (!e) return;
      const range = track.offsetHeight - window.innerHeight;
      const y = Math.min(Math.max(window.scrollY - track.offsetTop, 0), Math.max(range, 0));
      e.setScroll(-y * WHEEL_RATE);
      if (e.isFocused && Math.abs(window.scrollY - lastY) > 2) e.stepBack();
      lastY = window.scrollY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const io = new IntersectionObserver(([en]) => engineRef.current?.setActive(en.isIntersecting), { rootMargin: "100px" });
    io.observe(track);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); io.disconnect(); };
  }, []);

  /* ---- pause the render loop while a full-screen page covers the room ---- */
  useEffect(() => {
    if (store.view === "gallery") { engineRef.current?.setActive(true); return; }
    const t = window.setTimeout(() => engineRef.current?.setActive(false), 450);
    showPill(0, 0, false);
    return () => window.clearTimeout(t);
  }, [store.view, showPill]);

  /* ---- glide back to the room after closing a page ---- */
  useEffect(() => {
    if (store.returnSeq > 0) engineRef.current?.focusProduct(store.returnProduct);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.returnSeq]);

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (store.view !== "gallery" || store.bagOpen) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const inHero = window.scrollY < window.innerHeight * TRACK_SCREENS;
      const eng = engineRef.current;
      if (!eng || !inHero) return;
      if (e.key === "ArrowRight") { eng.next(); }
      else if (e.key === "ArrowLeft") { eng.prev(); }
      else if (e.key === "Escape") { eng.stepBack(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store.view, store.bagOpen]);

  const hint = focused ? site.hero.hintFocus : site.hero.hintWalk;
  const skip = () => {
    const t = trackRef.current!;
    window.scrollTo({ top: t.offsetTop + t.offsetHeight, behavior: "smooth" });
  };

  return (
    <section id="gallery" ref={trackRef} className="track" style={{ height: `${TRACK_SCREENS * 100}svh` }} aria-label="3D gallery">
      <div className="hero">
        <div ref={stageRef} className="hero__stage" />
        <div ref={veilRef} className="hero__veil" />

        <div className={`gui ${store.view !== "gallery" ? "is-hidden" : ""}`}>
          <div className="gui__arrows">
            <button className="round" aria-label="Previous print" onClick={() => engineRef.current?.prev()}><ArrowLeft /></button>
            <button className="round" aria-label="Next print" onClick={() => engineRef.current?.next()}><ArrowRight /></button>
          </div>

          <div className="gui__hint" aria-live="polite">
            <Line>{hint[0]}</Line>
            <Line>{hint[1]}</Line>
          </div>

          <div className="gui__toggle" role="group" aria-label="View">
            <button className="is-on" aria-pressed="true">Gallery</button>
            <button aria-pressed="false" onClick={store.openList}>List</button>
          </div>

          <button className="gui__skip" onClick={skip} aria-label={site.hero.skip}>
            <span>{site.hero.skip}</span><ArrowDown />
          </button>

          <div className="caption">
            <p className="caption__kicker"><Line>{site.hero.kicker}</Line></p>
            <div className="caption__row">
              <h1 className="caption__title"><Line>{site.hero.headline}</Line></h1>
              <button className="caption__link" onClick={store.openList}>
                <Line>{site.hero.enter} →</Line>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={pillRef} className="pill" aria-hidden>Open the print</div>
    </section>
  );
}
