import { Brain, Compass, Eye } from "lucide-react";
import Reveal from "./Reveal";

const roles = [
  { icon: Brain, title: "Analyste", desc: "Il lit vos données et en sort le sens." },
  { icon: Compass, title: "Stratège", desc: "Il transforme les chiffres en décisions claires." },
  { icon: Eye, title: "Veilleur", desc: "Il garde l'œil ouvert pendant que vous travaillez." },
];

export default function CeQueKairosFait() {
  return (
    <section id="role" className="border-t border-border/60">
      <div className="container-tight py-28 md:py-32">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Ce que Kairos fait</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            Trois rôles. Un seul abonnement.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {roles.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <r.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight">{r.title}</h3>
                <p className="mt-2 text-muted-foreground">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
