import Reveal from "./Reveal";

const items = [
  { n: "01", t: "Design", d: "Des interfaces épurées, pensées pour mettre en valeur l'essentiel." },
  { n: "02", t: "Performance", d: "Des sites rapides, fluides et optimisés sur tous les écrans." },
  { n: "03", t: "Kairos", d: "Une intelligence qui observe votre marché et anticipe vos visiteurs." },
];

export default function Approach() {
  return (
    <section id="approche" className="relative bg-white py-28 text-black md:py-40">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-6 text-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-black/40">Notre approche</p>
          <h2 className="display-xl mx-auto mt-6 max-w-3xl text-4xl font-semibold sm:text-5xl md:text-6xl">
            On construit des sites qui marquent et qui performent.
          </h2>
        </Reveal>

        <div className="mt-20 grid w-full gap-x-12 gap-y-14 sm:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.n} delay={i * 0.12}>
              <div className="group flex flex-col items-center">
                <span className="text-sm font-medium tabular-nums text-black/30">{it.n}</span>
                <span className="mt-5 h-px w-10 bg-black/20 transition-all duration-500 group-hover:w-16 group-hover:bg-black/60" />
                <h3 className="mt-5 text-2xl font-semibold">{it.t}</h3>
                <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-black/55">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
