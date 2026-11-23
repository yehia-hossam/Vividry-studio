"use client";
import { useEffect, useRef } from "react";
import { products } from "@/config/products";
import { money } from "@/lib/format";
import { useStore } from "@/components/providers/StoreProvider";
import { ArtImage } from "@/components/ui/ArtImage";
import { Close, Trash } from "@/components/ui/Icons";

/** Slide-in shopping bag. Wire the checkout button to Stripe / Shopify / your backend. */
export default function BagDrawer() {
  const { bagOpen, closeBag, bag, subtotal, setQty, removeLine, lastAdded } = useStore();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.toggleAttribute("inert", !bagOpen); }, [bagOpen]);

  return (
    <>
      <div className={`scrim ${bagOpen ? "is-open" : ""}`} onClick={closeBag} aria-hidden />
      <aside ref={ref} className={`drawer ${bagOpen ? "is-open" : ""}`} aria-label="Your bag" aria-hidden={!bagOpen}>
        <header className="drawer__head">
          <h2>Your bag</h2>
          <button aria-label="Close bag" onClick={closeBag}><Close /></button>
        </header>

        {bag.length === 0 ? (
          <p className="drawer__empty">Your bag is empty</p>
        ) : (
          <ul className="drawer__items">
            {bag.map((l) => {
              const p = products[l.product];
              return (
                <li key={l.key} className={`line ${l.key === lastAdded ? "is-new" : ""}`}>
                  <div className="line__img"><ArtImage product={p} /></div>
                  <div className="line__info">
                    <p className="line__title">{p.title}</p>
                    <p className="line__artist">{p.artist}</p>
                    <p className="line__size">{l.size}</p>
                    <p className="line__size">{l.paper} · {l.frame}</p>
                    <div className="line__ctrl">
                      <div className="qty qty--sm">
                        <button aria-label="Decrease" onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                        <span>{l.qty}</span>
                        <button aria-label="Increase" onClick={() => setQty(l.key, l.qty + 1)}>+</button>
                      </div>
                      <button className="line__trash" aria-label={`Remove ${p.title}`} onClick={() => removeLine(l.key)}><Trash /></button>
                    </div>
                  </div>
                  <p className="line__price">{money(l.unit * l.qty)}</p>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="drawer__foot">
          <p className="drawer__sub"><span>Subtotal</span><span>{money(subtotal)}</span></p>
          <button className="drawer__checkout" disabled={bag.length === 0} onClick={() => alert("Connect your checkout here (Stripe, Shopify, etc.)")}>Checkout →</button>
        </footer>
      </aside>
    </>
  );
}
