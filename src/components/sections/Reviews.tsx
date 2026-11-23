import { site } from "@/config/site";
import { Star } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

export default function Reviews() {
  return (
    <section id="reviews" className="section reviews">
      <Reveal><h2 className="h2">{site.reviews.title}</h2></Reveal>
      <ul className="reviews__grid">
        {site.reviews.items.map((r, i) => (
          <li key={r.name}>
            <Reveal delay={i * 90} className="review">
              <p className="review__stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((s) => (<Star key={s} />))}</p>
              <blockquote>{r.quote}</blockquote>
              <p className="review__by">{r.name}<span>{r.place}</span></p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
