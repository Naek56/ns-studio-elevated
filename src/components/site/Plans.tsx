import { Check } from "lucide-react";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Kairos Local",
    price: "49",
    tagline: "Pour les commerces et services de proximité.",
    features: ["1 secteur surveillé", "Briefing hebdomadaire", "Concurrents locaux", "Alertes par email"],
    highlight: false,
  },
  {
    name: "Kairos Pro",
    price: "149",
    tagline: "Pour les marques qui veulent garder une longueur d'avance.",
    features: ["Secteurs illimités", "Briefing quotidien", "Tous les modules", "Analyste dédié", "Alertes en temps réel"],
    highlight: true,
  },
];

export default function Plans() {
  return (
    <section id="plans" className="border-t border-border/60">
      <div className="container-tight py-28 md:py-32">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Les plans</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            Des plans simples.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-8",
                  p.highlight ? "border-primary/60 bg-primary/[0.06]" : "border-border bg-card"
                )}
              >
                {p.highlight && (
                  <span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Populaire
                  </span>
                )}
                <h3 className="font-display text-xl font-bold tracking-tight">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-5xl font-extrabold tracking-tight">{p.price}</span>
                  <span className="mb-1.5 text-lg text-muted-foreground">€ / mois</span>
                </div>

                <ul className="mt-7 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check
                        className={cn("h-4 w-4 shrink-0", p.highlight ? "text-primary" : "text-yellow")}
                      />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:hello@nsintelligence.com"
                  className={cn("mt-8", p.highlight ? "btn-liquid-accent" : "btn-liquid")}
                >
                  Choisir {p.name.replace("Kairos ", "")}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
