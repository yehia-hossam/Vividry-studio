"use client";
import { site, type NavLink } from "@/config/site";
import { useStore } from "@/components/providers/StoreProvider";

export default function Footer() {
  const { openList, goRoom } = useStore();
  const click = (l: NavLink) => (e: React.MouseEvent) => {
    if (l.action === "list") { e.preventDefault(); openList(); }
    else if (l.action === "gallery") { e.preventDefault(); goRoom(); }
  };
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <p className="footer__logo">{site.name}</p>
          <p>{site.footer.blurb}</p>
        </div>
        {site.footer.columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3>{c.title}</h3>
            <ul>
              {c.links.map((l) => (
                <li key={l.label}><a href={l.href ?? "#"} onClick={click(l)}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="footer__bottom">
        <p>{site.footer.legal}</p>
        <ul>{site.footer.socials.map((s) => (<li key={s.label}><a href={s.href}>{s.label}</a></li>))}</ul>
      </div>
    </footer>
  );
}
