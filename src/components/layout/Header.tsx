"use client";
import { useEffect, useState } from "react";
import { site, type NavLink } from "@/config/site";
import { useStore } from "@/components/providers/StoreProvider";
import { Bag, Close, Menu } from "@/components/ui/Icons";

export default function Header() {
  const { view, bagCount, openBag, openList, goRoom, closeOverlay } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (l: NavLink) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    if (l.action === "gallery") return goRoom();
    if (l.action === "list") return openList();
    if (l.href) {
      closeOverlay();
      requestAnimationFrame(() => document.querySelector(l.href!)?.scrollIntoView({ behavior: "smooth" }));
    }
  };

  const solid = scrolled || view !== "gallery" || menu;
  return (
    <header className={`nav ${solid ? "is-solid" : ""}`}>
      <a href="#gallery" className="nav__logo" data-intro="nav" onClick={(e) => { e.preventDefault(); setMenu(false); goRoom(); }}>
        {site.name}
      </a>
      <nav className="nav__links" aria-label="Main">
        {site.nav.map((l) => (
          <a key={l.label} href={l.href ?? "#"} data-intro="nav" onClick={go(l)}>{l.label}</a>
        ))}
      </nav>
      <div className="nav__right">
        <button className="nav__cta" data-intro="nav" onClick={openList}>Shop prints</button>
        <button className="nav__icon" data-intro="nav" aria-label={`Open bag, ${bagCount} items`} onClick={openBag}>
          <Bag />
          {bagCount > 0 && <span className="nav__badge">{bagCount}</span>}
        </button>
        <button className="nav__icon nav__burger" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
          {menu ? <Close /> : <Menu />}
        </button>
      </div>
      {menu && (
        <div className="nav__panel">
          {site.nav.map((l) => (<a key={l.label} href={l.href ?? "#"} onClick={go(l)}>{l.label}</a>))}
        </div>
      )}
    </header>
  );
}
