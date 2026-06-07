import { EyeOff, Eye } from "lucide-react";
import Reveal from "./Reveal";

export default function Approche() {
  return (
    <section id="approche" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary-glow))]">
          Le constat
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl font-bold tracking-tight md:text-5xl">
          La plupart des sites sont{" "}
          <span className="font-serif-accent italic text-gradient-primary">aveugles.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-muted-foreground">
          Un beau site qui ne mesure rien, c'est une vitrine dans le noir. Chez NSI, le design
          et la donnée avancent ensemble — pour que vous sachiez, enfin, ce qui transforme un visiteur en client.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl border border-border/70 bg-card/40 p-8 backdrop-blur-sm">
            <span className="inline-flex rounded-2xl bg-white/5 p-3 text-muted-foreground">
              <EyeOff className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-muted-foreground">Un site classique</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground/80">
              {[
                "Joli, mais vous ignorez où vos visiteurs décrochent",
                "Aucune idée de ce qui génère vraiment des ventes",
                "Des décisions prises au feeling",
                "Mise à jour rare, performance qui se dégrade",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative h-full overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <span className="inline-flex rounded-2xl bg-primary/15 p-3 text-[hsl(var(--primary-glow))]">
              <Eye className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-foreground">Un site NS Intelligence</h3>
            <ul className="mt-4 space-y-3 text-sm text-foreground/90">
              {[
                "Vous voyez chaque parcours, chaque clic, chaque hésitation",
                "Vous savez exactement ce qui convertit — et ce qui freine",
                "Des décisions guidées par la donnée, pas par l'intuition",
                "Optimisation continue, performance maintenue au sommet",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary-glow))]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
