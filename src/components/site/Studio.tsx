import Reveal from "./Reveal";

const capabilities = [
  { n: "01", t: "Stratégie", d: "Comprendre le marché, le positionnement, l'intention." },
  { n: "02", t: "Design", d: "Une direction artistique forte, jamais générique." },
  { n: "03", t: "Expérience", d: "Des sites qui se vivent, pas qui se lisent." },
  { n: "04", t: "Développement", d: "Performance, motion, détails au pixel près." },
];

export default function Studio() {
  return (
    <section id="studio" className="section">
      <div className="container-tight">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Le studio</p>
          <h2 className="display-xl mt-7 max-w-3xl text-balance text-4xl sm:text-5xl md:text-6xl">
            Bien plus qu'une agence.
          </h2>
          <p className="mt-7 max-w-xl text-lg text-muted-foreground">
            WAY conçoit des expériences web qui marquent les esprits et font la différence. Chaque projet est une signature, pas un modèle.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.n} delay={(i % 2) * 0.08}>
              <div className="group h-full bg-background p-8 transition-colors duration-300 hover:bg-card md:p-10">
                <span className="font-display text-sm font-bold text-muted-foreground">{c.n}</span>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{c.t}</h3>
                <p className="mt-2 text-muted-foreground">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
