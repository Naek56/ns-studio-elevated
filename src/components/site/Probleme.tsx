import Reveal from "./Reveal";

export default function Probleme() {
  return (
    <section id="probleme" className="border-t border-border/60">
      <div className="container-tight py-28 md:py-36">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Le problème</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Vos visiteurs repartent sans acheter.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Pas parce que votre offre est mauvaise. Parce que personne ne vous dit ce qu'ils cherchent, ni ce que font vos concurrents pendant ce temps.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
