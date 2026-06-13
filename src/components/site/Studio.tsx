import Reveal from "./Reveal";

const capabilities = [
  { n: "01", t: "Stratégie", d: "Comprendre le marché, le positionnement, l'intention." },
  { n: "02", t: "Design", d: "Une direction artistique forte, jamais générique." },
  { n: "03", t: "Expérience", d: "Des sites qui se vivent, pas qui se lisent." },
  { n: "04", t: "Développement", d: "Performance, motion, détails au pixel près." },
];

export default function Studio() {
  return (
    <section id="studio" className="section relative md:flex md:min-h-screen md:items-center">
      <div className="container-tight">
        <div className="md:max-w-[46%] md:ml-auto">
          <Reveal>
            <p className="legible text-xs uppercase tracking-[0.4em] text-muted-foreground">Le studio</p>
            <h2 className="display-xl mt-6 text-balance text-4xl sm:text-5xl md:text-6xl">Bien plus qu'une agence.</h2>
            <p className="legible mt-6 max-w-md text-lg text-muted-foreground">
              WAY conçoit des expériences web qui marquent les esprits. Chaque projet est une signature, pas un modèle.
            </p>
          </Reveal>

          <div className="mt-10 space-y-px border-t border-border/70">
            {capabilities.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.06}>
                <div className="flex items-baseline gap-5 border-b border-border/70 py-5">
                  <span className="font-display text-sm font-bold text-muted-foreground">{c.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight">{c.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
