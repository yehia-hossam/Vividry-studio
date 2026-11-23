"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { productOptions, products } from "@/config/products";
import { money } from "@/lib/format";
import { useReducedMotion } from "@/hooks/useMedia";
import { useStore } from "@/components/providers/StoreProvider";
import { Accordion } from "@/components/ui/Accordion";
import { ArtImage } from "@/components/ui/ArtImage";
import { Bookmark, Cube } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";

const FLY_MS = 300;
const DETAILS_DELAY = 1000;

function Chips({ label, value, options, onChange }: { label: string; value: number; options: { label: string }[]; onChange: (i: number) => void }) {
  return (
    <div className="opt">
      <p className="opt__label">{label} <span>{options[value].label}</span></p>
      <div className="opt__chips" role="radiogroup" aria-label={label}>
        {options.map((o, i) => (
          <button key={o.label} role="radio" aria-checked={i === value} className={`chip ${i === value ? "is-on" : ""}`} onClick={() => onChange(i)}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { view, product: idx, origin, source, openSeq, addLine, goRoom, closeOverlay } = useStore();
  const reduced = useReducedMotion();
  const open = view === "product";
  const p = products[idx];

  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const [paper, setPaper] = useState(0);
  const [size, setSize] = useState(0);
  const [sig, setSig] = useState(0);
  const [frame, setFrame] = useState(0);
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const [details, setDetails] = useState(false);

  const o = productOptions;
  const unit = useMemo(
    () => p.price + o.paper[paper].delta + o.size[size].delta + o.signature[sig].delta + o.frame[frame].delta,
    [p.price, o, paper, size, sig, frame],
  );

  useEffect(() => { rootRef.current?.toggleAttribute("inert", !open); }, [open]);

  // Fly the print from where it was clicked into the image box, then reveal the details.
  useEffect(() => {
    if (!open) return;
    setPaper(0); setSize(0); setSig(0); setFrame(0); setQty(1); setSaved(false);
    setImgReady(false); setDetails(false);
    rootRef.current?.scrollTo({ top: 0 });
    const timers: number[] = [];
    const flyer = flyerRef.current;
    const box = imgRef.current;
    if (!origin || reduced || !flyer || !box) {
      setImgReady(true); setDetails(true);
      return;
    }
    const raf = requestAnimationFrame(() => {
      const t = box.getBoundingClientRect();
      flyer.style.cssText = `display:block;left:${origin.left}px;top:${origin.top}px;width:${origin.width}px;height:${origin.height}px;`;
      const anim = flyer.animate(
        [
          { transform: "translate(0,0) scale(1,1)" },
          { transform: `translate(${t.left - origin.left}px,${t.top - origin.top}px) scale(${t.width / origin.width},${t.height / origin.height})` },
        ],
        { duration: FLY_MS, easing: "cubic-bezier(.25,.75,.25,1)", fill: "forwards" },
      );
      anim.finished.then(() => { setImgReady(true); flyer.style.display = "none"; }).catch(() => undefined);
      timers.push(window.setTimeout(() => setDetails(true), DETAILS_DELAY));
    });
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); flyer.getAnimations().forEach((a) => a.cancel()); flyer.style.display = "none"; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, openSeq]);

  const add = () =>
    addLine({ product: idx, paper: o.paper[paper].label, size: o.size[size].label, signature: o.signature[sig].label, frame: o.frame[frame].label, qty, unit });

  const band = [0, 1, 2, 3].map((k) => (idx + k) % products.length);

  return (
    <section ref={rootRef} className={`page ${open ? "is-open" : ""}`} aria-label={p.title} aria-hidden={!open}>
      <div className="page__grid">
        <div className="page__left">
          <div className="page__sticky">
            <div ref={imgRef} className="page__image" style={{ visibility: imgReady ? "visible" : "hidden" }}>
              <ArtImage product={p} priority />
            </div>
            <div className={`page__meta fade ${details ? "in" : ""}`}>
              <span>1/1</span>
              <button onClick={goRoom}><Cube /> View in room</button>
              <button aria-pressed={saved} aria-label="Save" onClick={() => setSaved((s) => !s)} className={saved ? "is-on" : ""}><Bookmark /></button>
            </div>
          </div>
        </div>

        <div className={`page__right fade ${details ? "in" : ""}`}>
          <button className="page__back" onClick={closeOverlay}>← Back</button>
          <h2 className="page__title">{p.title}</h2>
          <p className="page__artist">{p.artist}, {p.year}</p>
          <p className="page__desc">{p.description}</p>
          <p className="page__price">{money(unit)}</p>
          <p className="page__tax">Prices include VAT. Shipping calculated at checkout.</p>

          <Chips label="Paper" value={paper} options={o.paper} onChange={setPaper} />
          <Chips label="Size" value={size} options={o.size} onChange={setSize} />
          <Chips label="Signature" value={sig} options={o.signature} onChange={setSig} />
          <div className="opt">
            <p className="opt__label">Frame <span>{o.frame[frame].label}</span></p>
            <div className="opt__frames" role="radiogroup" aria-label="Frame">
              {o.frame.map((f, i) => (
                <button key={f.label} role="radio" aria-checked={i === frame} className={`frame ${i === frame ? "is-on" : ""}`} onClick={() => setFrame(i)}>
                  <span className={`frame__thumb frame__thumb--${f.style}`}><ArtImage product={p} /></span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="buy">
            <div className="qty" aria-label="Quantity">
              <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button aria-label="Increase" onClick={() => setQty((q) => Math.min(9, q + 1))}>+</button>
            </div>
            <button className="buy__add" onClick={add}>Add to bag</button>
          </div>

          <Accordion items={[...o.accordion]} className="page__acc" />
        </div>
      </div>

      <div className={`band fade ${details ? "in" : ""}`}>
        <h3 className="band__title">Get the collection</h3>
        <div className="band__row">
          {band.map((i) => (<ProductCard key={products[i].id} product={products[i]} index={i} source={source} className="card--band" />))}
        </div>
      </div>

      <div ref={flyerRef} className="flyer" style={{ backgroundImage: `url(${p.image})` }} aria-hidden />
    </section>
  );
}
