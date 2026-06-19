import Reveal from "./Reveal";

const items = [
  { n: "01", t: "Stratégie", d: "Comprendre le marché, le positionnement, l'intention." },
  { n: "02", t: "Design", d: "Une direction artistique forte, jamais générique." },
  { n: "03", t: "Expérience", d: "Des sites qui se vivent, pas qui se lisent." },
];

export default function Studio() {
  return (
    <section id="studio" className="relative border-t border-white/5 py-24 md:py-40">
      <div className="container-wide">
        <Reveal>
          <p className="label">Le studio</p>
          <h2 className="display-xl mt-7 max-w-4xl text-balance text-5xl sm:text-6xl md:text-7xl">
            Chaque projet est une signature.{" "}
            <span className="italic text-muted-foreground">Pas un modèle.</span>
          </h2>
          <p className="mt-7 max-w-xl text-base text-muted-foreground sm:text-lg">
            WAY conçoit des expériences web qui marquent les esprits.
          </p>
        </Reveal>

        <div className="mt-16 grid border-t border-white/10 sm:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.n} delay={i * 0.1}>
              <div className="relative overflow-hidden px-2 py-10 sm:px-8 sm:py-12 sm:border-l sm:border-white/10 sm:first:border-l-0 sm:first:pl-0">
                <span
                  className="watermark display-xl pointer-events-none absolute -top-4 right-2 select-none leading-none"
                  style={{ fontSize: "clamp(90px, 10vw, 150px)" }}
                >
                  {it.n}
                </span>
                <h3 className="relative font-display text-3xl font-light">{it.t}</h3>
                <p className="relative mt-3 max-w-xs text-sm text-muted-foreground">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
