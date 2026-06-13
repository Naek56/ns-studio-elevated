import Reveal from "./Reveal";

const traits = [
  { t: "Observe", d: "Votre marché, vos concurrents, vos clients. En continu." },
  { t: "Comprend", d: "Au delà des chiffres, le sens et les signaux faibles." },
  { t: "Anticipe", d: "Ce qui arrive, avant que ça n'arrive." },
];

export default function Kairos() {
  return (
    <section id="kairos" className="section relative md:flex md:min-h-screen md:items-center">
      <div className="container-tight">
        <div className="md:max-w-[46%] md:mr-auto">
          <Reveal>
            <p className="legible text-xs uppercase tracking-[0.45em] text-muted-foreground">Notre intelligence</p>
            <h2 className="display-xl mt-6 text-balance text-4xl sm:text-5xl md:text-6xl">
              Nous avons créé <span className="italic">Kairos.</span>
            </h2>
            <p className="legible mt-6 max-w-md text-lg text-muted-foreground">
              Une intelligence qui voit ce que vos concurrents voient déjà. Et bien plus encore.
            </p>
          </Reveal>

          <div className="mt-10 space-y-5">
            {traits.map((t, i) => (
              <Reveal key={t.t} delay={i * 0.08}>
                <div className="border-l border-white/20 pl-5">
                  <h3 className="font-display text-xl font-bold tracking-tight">{t.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
