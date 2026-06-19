import Reveal from "./Reveal";
import Cta from "./Cta";

export default function Manifesto() {
  return (
    <section id="manifeste" className="relative border-t border-white/5 py-24 md:py-40">
      <div className="container-wide grid items-center gap-14 lg:grid-cols-2">
        {/* left: copy */}
        <Reveal>
          <p className="label">Le constat</p>
          <h2 className="display-xl mt-7 text-balance text-5xl sm:text-6xl md:text-7xl">
            Voir avant les autres.{" "}
            <span className="italic text-muted-foreground">Voilà tout.</span>
          </h2>
          <p className="mt-7 max-w-md text-base text-muted-foreground sm:text-lg">
            La plupart des marques avancent à l'aveugle. Nous, nous regardons. Et nous transformons ce que nous voyons en avance.
          </p>
          <Cta label="Voir ce qu'on peut faire" />
        </Reveal>

        {/* right: typographic stat */}
        <Reveal delay={0.1}>
          <div className="relative flex items-center justify-center py-10">
            <span
              className="watermark display-xl select-none leading-none"
              style={{ fontSize: "clamp(140px, 24vw, 240px)" }}
            >
              97%
            </span>
            <span
              className="absolute font-mono text-xs sm:text-sm"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              des visiteurs repartent sans jamais revenir.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
