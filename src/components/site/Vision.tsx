import Reveal from "./Reveal";
import Cta from "./Cta";

const principles = [
  { t: "Le design est une arme", d: "Pas une décoration. Une façon de gagner du terrain." },
  { t: "L'avance est un choix", d: "Savoir avant, c'est décider mieux et plus vite." },
  { t: "Le détail fait la marque", d: "Ce que les autres négligent, nous le travaillons." },
];

export default function Vision() {
  return (
    <section id="vision" className="relative flex min-h-screen flex-col justify-center">
      <div className="container-tight">
        <div className="w-full rounded-3xl border border-white/10 bg-background/55 p-6 backdrop-blur-md lg:w-[54%] lg:ml-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <Reveal>
            <p className="legible text-xs uppercase tracking-[0.35em] text-muted-foreground sm:text-sm">Notre conviction</p>
            <h2 className="display-xl mt-5 text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Nous ne suivons pas. Nous traçons.</h2>
          </Reveal>

          <div className="mt-6 space-y-px border-t border-border/70 lg:mt-10">
            {principles.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06}>
                <div className="border-b border-border/70 py-4 lg:py-6">
                  <h3 className="font-display text-lg font-bold tracking-tight lg:text-2xl">{p.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground lg:text-base">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Cta label="Travailler avec nous" />
        </div>
      </div>
    </section>
  );
}
