import Reveal from "./Reveal";

const cadence = [
  { freq: "Quotidien", line: "Chaque matin, l'essentiel en deux minutes.", color: "hsl(var(--yellow))" },
  { freq: "Hebdomadaire", line: "Le récap de la semaine, chaque lundi.", color: "hsl(var(--primary))" },
  { freq: "Mensuel", line: "La vue d'ensemble et les tendances de fond.", color: "hsl(var(--red))" },
];

export default function Frequence() {
  return (
    <section id="frequence" className="border-t border-border/60">
      <div className="container-tight py-28 md:py-32">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">La fréquence</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            À votre rythme.
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-border/70 border-y border-border/70">
          {cadence.map((c, i) => (
            <Reveal key={c.freq} delay={i * 0.06}>
              <div className="flex flex-col gap-2 py-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="font-display text-2xl font-bold tracking-tight">{c.freq}</span>
                </div>
                <span className="pl-7 text-muted-foreground sm:pl-0">{c.line}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
