import Reveal from "./Reveal";
import Cta from "./Cta";

const traits = [
  { t: "Observe", d: "Votre marché, vos concurrents, vos clients. En continu." },
  { t: "Comprend", d: "Au delà des chiffres, le sens et les signaux faibles." },
  { t: "Anticipe", d: "Ce qui arrive, avant que ça n'arrive." },
];

export default function Kairos() {
  return (
    <section id="kairos" className="relative flex min-h-screen flex-col justify-center">
      <div className="container-tight">
        <div className="w-full lg:w-[54%] lg:mr-auto">
          <Reveal>
            <p className="legible text-xs uppercase tracking-[0.4em] text-muted-foreground sm:text-sm">Notre intelligence</p>
            <h2 className="display-xl mt-5 text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Nous avons créé <span className="italic">Kairos.</span>
            </h2>
            <p className="legible mt-5 max-w-md text-sm text-muted-foreground sm:text-base lg:text-lg">
              Une intelligence qui voit ce que vos concurrents voient déjà. Et bien plus encore.
            </p>
          </Reveal>

          <div className="mt-6 space-y-4 lg:mt-10 lg:space-y-5">
            {traits.map((t, i) => (
              <Reveal key={t.t} delay={i * 0.08}>
                <div className="border-l border-white/20 pl-4 lg:pl-5">
                  <h3 className="font-display text-lg font-bold tracking-tight lg:text-xl">{t.t}</h3>
                  <p className="mt-1 text-xs text-muted-foreground lg:text-sm">{t.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Cta label="Découvrir Kairos" />
        </div>
      </div>
    </section>
  );
}
