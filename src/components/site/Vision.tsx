import Reveal from "./Reveal";

const principles = [
  { t: "Le design est une arme", d: "Pas une décoration. Une façon de gagner du terrain." },
  { t: "L'avance est un choix", d: "Savoir avant, c'est décider mieux et plus vite." },
  { t: "Le détail fait la marque", d: "Ce que les autres négligent, nous le travaillons." },
];

export default function Vision() {
  return (
    <section id="vision" className="section">
      <div className="container-tight">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Notre conviction</p>
          <h2 className="display-xl mt-7 max-w-3xl text-balance text-4xl sm:text-5xl md:text-6xl">
            Nous ne suivons pas. Nous traçons.
          </h2>
        </Reveal>

        <div className="mt-20 space-y-px">
          {principles.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="flex flex-col gap-3 border-t border-border py-10 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl md:max-w-md">{p.t}</h3>
                <p className="text-muted-foreground md:max-w-sm md:text-right">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
