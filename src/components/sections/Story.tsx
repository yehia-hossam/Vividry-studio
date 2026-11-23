"use client";
import { products } from "@/config/products";
import { site } from "@/config/site";
import { useStore } from "@/components/providers/StoreProvider";
import { ArtImage } from "@/components/ui/ArtImage";
import { Reveal } from "@/components/ui/Reveal";

export default function Story() {
  const { openList } = useStore();
  return (
    <section id="story" className="section story">
      <Reveal className="story__copy">
        <h2 className="h2">{site.story.title}</h2>
        {site.story.text.map((t) => (<p key={t} className="lead">{t}</p>))}
        <button className="btn btn--light" onClick={openList}>{site.story.cta}</button>
        <dl className="story__stats">
          {site.story.stats.map((s) => (
            <div key={s.label}><dt>{s.value}</dt><dd>{s.label}</dd></div>
          ))}
        </dl>
      </Reveal>
      <Reveal className="story__art" delay={120}>
        {[5, 0, 3].map((i, n) => (
          <div key={i} className={`story__piece story__piece--${n}`}><ArtImage product={products[i]} /></div>
        ))}
      </Reveal>
    </section>
  );
}
