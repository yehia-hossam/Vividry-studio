"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type View = "gallery" | "product" | "list";
export type Source = "gallery" | "list" | "section";
export interface Rect { left: number; top: number; width: number; height: number }

export interface BagLine {
  key: string; product: number; paper: string; size: string; signature: string; frame: string; qty: number; unit: number;
}

interface Store {
  view: View;
  product: number;
  origin: Rect | null;
  source: Source;
  openSeq: number;
  returnSeq: number;
  returnProduct: number;
  bagOpen: boolean;
  bag: BagLine[];
  lastAdded: string | null;
  bagCount: number;
  subtotal: number;
  openProduct: (i: number, origin?: Rect | null, source?: Source) => void;
  openList: () => void;
  closeOverlay: () => void;
  /** Close everything, scroll to the top and glide back to the room. */
  goRoom: () => void;
  openBag: () => void;
  closeBag: () => void;
  addLine: (line: Omit<BagLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
}

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
};

const STORAGE_KEY = "vividry-bag";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("gallery");
  const [product, setProduct] = useState(0);
  const [origin, setOrigin] = useState<Rect | null>(null);
  const [openSeq, setOpenSeq] = useState(0);
  const [returnSeq, setReturnSeq] = useState(0);
  const [bagOpen, setBagOpen] = useState(false);
  const [bag, setBag] = useState<BagLine[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const source = useRef<Source>("gallery");
  const hydrated = useRef(false);

  // Persist the bag in localStorage (swap for your backend / cart API when you go live).
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setBag(JSON.parse(raw)); } catch { /* ignore */ }
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bag)); } catch { /* ignore */ }
  }, [bag]);

  // Lock page scroll while an overlay is open.
  useEffect(() => {
    document.documentElement.style.overflow = view !== "gallery" || bagOpen ? "hidden" : "";
  }, [view, bagOpen]);

  const openProduct = useCallback((i: number, o: Rect | null = null, s: Source = "gallery") => {
    source.current = s;
    setProduct(i); setOrigin(o); setOpenSeq((n) => n + 1); setView("product");
  }, []);
  const openList = useCallback(() => { setView("list"); setBagOpen(false); }, []);
  const closeOverlay = useCallback(() => {
    if (view === "product" && source.current === "list") { setView("list"); return; }
    if (view === "product" && source.current === "gallery") setReturnSeq((n) => n + 1);
    setView("gallery");
  }, [view]);
  const goRoom = useCallback(() => {
    setView("gallery"); setBagOpen(false);
    window.scrollTo({ top: 0 });
    setReturnSeq((n) => n + 1);
  }, []);

  const addLine = useCallback((line: Omit<BagLine, "key">) => {
    const key = [line.product, line.paper, line.size, line.signature, line.frame].join("|");
    setBag((prev) => {
      const hit = prev.find((l) => l.key === key);
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + line.qty) } : l));
      return [...prev, { ...line, key }];
    });
    setLastAdded(key);
    setBagOpen(true);
  }, []);
  const setQty = useCallback((key: string, qty: number) =>
    setBag((p) => p.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l))), []);
  const removeLine = useCallback((key: string) => setBag((p) => p.filter((l) => l.key !== key)), []);

  // Escape closes the drawer first, then any page / list.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (bagOpen) setBagOpen(false);
      else if (view !== "gallery") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bagOpen, view, closeOverlay]);

  const value = useMemo<Store>(() => ({
    view, product, origin, source: source.current, openSeq, returnSeq, returnProduct: product, bagOpen, bag, lastAdded,
    bagCount: bag.reduce((n, l) => n + l.qty, 0),
    subtotal: bag.reduce((n, l) => n + l.qty * l.unit, 0),
    openProduct, openList, closeOverlay, goRoom,
    openBag: () => setBagOpen(true), closeBag: () => setBagOpen(false),
    addLine, setQty, removeLine,
  }), [view, product, origin, openSeq, returnSeq, bagOpen, bag, lastAdded, openProduct, openList, closeOverlay, goRoom, addLine, setQty, removeLine]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
