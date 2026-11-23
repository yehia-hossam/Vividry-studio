import { Star } from "@/components/ui/Icons";
import { site } from "@/config/site";

/** Infinite CSS ticker. Content is duplicated once so the loop is seamless. */
export default function Marquee() {
  const row = (hidden = false) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {site.marquee.map((t) => (<li key={t + hidden}>{t}<Star /></li>))}
    </ul>
  );
  return (
    <div className="marquee">
      <div className="marquee__track">{row()}{row(true)}</div>
    </div>
  );
}
