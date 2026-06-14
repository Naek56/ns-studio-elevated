import Reveal from "./Reveal";
import Cta from "./Cta";

const capabilities = [
  { n: "01", t: "Stratégie", d: "Comprendre le marché, le positionnement, l'intention." },
  { n: "02", t: "Design", d: "Une direction artistique forte, jamais générique." },
  { n: "03", t: "Expérience", d: "Des sites qui se vivent, pas qui se lisent." },
  { n: "04", t: "Développement", d: "Performance, motion, détails au pixel près." },
];

export default function Studio() {
  return (
    <section id="studio" className="relative flex min-h-screen items-center">
      <div className="container-tight">
        <div className="w-[54%] ml-auto">
          <Reveal>
            <p className="legible text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">Le studio</p>
            <h2 className="display-xl mt-4 text-balance text-2xl sm:text-3xl md:text-4xl lg:text-6xl">Bien plus qu'une agence.</h2>
            <p className="legible mt-4 max-w-md text-xs text-muted-foreground sm:text-sm lg:text-lg">
              WAY conçoit des expériences web qui marquent les esprits. Chaque projet est une signature, pas un modèle.
            </p>
          </Reveal>

          <div className="mt-6 space-y-px border-t border-border/70 lg:mt-10">
            {capabilities.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.06}>
                <div className="flex items-baseline gap-3 border-b border-border/70 py-3 lg:gap-5 lg:py-5">
                  <span className="font-display text-xs font-bold text-muted-foreground lg:text-sm">{c.n}</span>
                  <div>
                    <h3 className="font-display text-base font-bold tracking-tight lg:text-xl">{c.t}</h3>
                    <p className="mt-1 text-[0.7rem] text-muted-foreground lg:text-sm">{c.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Cta label="Démarrer un projet" />
        </div>
      </div>
    </section>
  );
}
