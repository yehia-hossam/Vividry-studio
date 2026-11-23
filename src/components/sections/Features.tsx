import { site } from "@/config/site";
import { featureIcons } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

export default function Features() {
  return (
    <section id="why" className="section features">
      <ul className="features__grid">
        {site.features.map((f, i) => {
          const Icon = featureIcons[f.icon];
          return (
            <li key={f.title} style={{ ["--tone" as string]: f.color }}>
              <Reveal delay={i * 70} className="features__card">
                <span className="features__icon"><Icon /></span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
