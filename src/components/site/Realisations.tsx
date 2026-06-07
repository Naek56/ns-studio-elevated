import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const projects = [
  { name: "Lumen Studio", cat: "Architecture · Portfolio", grad: "from-orange-500/30 via-amber-400/10 to-transparent", metric: "+180% de demandes" },
  { name: "Velar", cat: "SaaS · B2B", grad: "from-amber-600/30 via-orange-500/10 to-transparent", metric: "x2,4 conversions" },
  { name: "Atelier Noë", cat: "E-commerce · Luxe", grad: "from-rose-500/25 via-orange-400/10 to-transparent", metric: "+92% panier moyen" },
  { name: "Orbit Health", cat: "Santé · Plateforme", grad: "from-yellow-500/25 via-orange-500/10 to-transparent", metric: "−38% rebond" },
];

export default function Realisations() {
  return (
    <section id="realisations" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary-glow))]">
              Réalisations
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight md:text-5xl">
              Des sites qui ont <span className="font-serif-accent italic text-gradient-primary">changé la donne.</span>
            </h2>
          </div>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={(i % 2) * 0.1}>
            <a
              href="#contact"
              className="group relative block overflow-hidden rounded-3xl border border-border/70 bg-card/40"
            >
              <div className={`relative aspect-[16/10] w-full bg-gradient-to-br ${p.grad}`}>
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-3xl font-bold tracking-tight text-foreground/90 md:text-4xl">
                    {p.name}
                  </span>
                </div>
                <div className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full liquid-glass text-foreground transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <span className="text-sm text-muted-foreground">{p.cat}</span>
                <span className="text-sm font-medium text-[hsl(var(--primary-glow))]">{p.metric}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
