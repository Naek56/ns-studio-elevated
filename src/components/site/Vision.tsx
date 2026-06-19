import Reveal from "./Reveal";

const principles = [
  { t: "Le design est une arme", d: "Pas une décoration. Une façon de gagner du terrain." },
  { t: "L'avance est un choix", d: "Savoir avant, c'est décider mieux et plus vite." },
  { t: "Le détail fait la marque", d: "Ce que les autres négligent, nous le travaillons." },
];

export default function Vision() {
  return (
    <section id="vision" className="relative border-t border-white/5 py-24 md:py-40">
      <div className="container-wide">
        <Reveal>
          <p className="label">Notre conviction</p>
          <h2 className="display-xl mt-7 max-w-5xl text-balance text-5xl sm:text-6xl md:text-7xl">
            Nous ne suivons pas. <span className="italic">Nous traçons.</span>
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-white/10">
          {principles.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08}>
              <div className="grid gap-3 border-b border-white/10 py-8 md:grid-cols-[1.2fr_1fr] md:items-baseline md:gap-10">
                <h3 className="font-display text-3xl font-light md:text-4xl">{p.t}</h3>
                <p className="text-base text-muted-foreground">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
