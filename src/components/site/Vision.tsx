import Reveal from "./Reveal";

const principles = [
  { t: "Le design est une arme", d: "Pas une décoration. Une façon de gagner du terrain." },
  { t: "L'avance est un choix", d: "Savoir avant, c'est décider mieux et plus vite." },
  { t: "Le détail fait la marque", d: "Ce que les autres négligent, nous le travaillons." },
];

export default function Vision() {
  return (
    <section id="vision" className="section relative md:flex md:min-h-screen md:items-center">
      <div className="container-tight">
        <div className="md:max-w-[46%] md:ml-auto">
          <Reveal>
            <p className="legible text-xs uppercase tracking-[0.4em] text-muted-foreground">Notre conviction</p>
            <h2 className="display-xl mt-6 text-balance text-4xl sm:text-5xl md:text-6xl">Nous ne suivons pas. Nous traçons.</h2>
          </Reveal>

          <div className="mt-10 space-y-px border-t border-border/70">
            {principles.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06}>
                <div className="border-b border-border/70 py-6">
                  <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">{p.t}</h3>
                  <p className="mt-1 text-muted-foreground">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
