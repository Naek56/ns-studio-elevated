import Reveal from "./Reveal";

const steps = [
  { n: "01", t: "Découverte", d: "On cerne vos objectifs, votre marché et ce qui doit générer du résultat." },
  { n: "02", t: "Design", d: "Direction artistique premium et maquettes interactives, validées ensemble." },
  { n: "03", t: "Build & data", d: "Développement haute performance + intégration de la couche analytique." },
  { n: "04", t: "Optimisation", d: "On lit les données, on itère, on fait grimper vos conversions dans le temps." },
];

export default function Process() {
  return (
    <section id="process" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary-glow))]">
          Notre process
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl font-bold tracking-tight md:text-5xl">
          Simple pour vous, <span className="font-serif-accent italic text-gradient-primary">rigoureux chez nous.</span>
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-5 md:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="relative h-full rounded-3xl border border-border/70 bg-card/40 p-7 backdrop-blur-sm">
              <span className="font-display text-4xl font-bold text-primary/30">{s.n}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
