import { site } from "@/config/site";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";

export default function Faq() {
  return (
    <section id="faq" className="section faq">
      <Reveal><h2 className="h2">{site.faq.title}</h2></Reveal>
      <Reveal delay={80}><Accordion className="faq__acc" items={site.faq.items.map((f) => ({ title: f.q, body: f.a }))} /></Reveal>
    </section>
  );
}
