import Reveal from "./Reveal";

const items = [
  { n: "01", t: "Design", d: "Des interfaces épurées, pensées pour mettre en valeur l'essentiel." },
  { n: "02", t: "Performance", d: "Des sites rapides, fluides et optimisés sur tous les écrans." },
  { n: "03", t: "Kairos", d: "Une intelligence qui observe votre marché et anticipe vos visiteurs." },
];

export default function Approach() {
  return (
    <section id="approche" className="relative bg-white py-28 text-black md:py-40">
      <div className="mx-auto max-w-[1100px] px-6">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-black/40">Notre approche</p>
          <h2 className="display-xl mt-6 max-w-3xl text-4xl font-semibold sm:text-5xl md:text-6xl">
            On construit des sites qui marquent et qui performent.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-x-12 gap-y-14 sm:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.n} delay={i * 0.1}>
              <div className="border-t border-black/15 pt-6">
                <span className="text-sm font-medium text-black/35">{it.n}</span>
                <h3 className="mt-4 text-2xl font-semibold">{it.t}</h3>
                <p className="mt-3 text-base leading-relaxed text-black/55">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
