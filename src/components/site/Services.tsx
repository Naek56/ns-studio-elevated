import { Palette, Gauge, LineChart, Search, Smartphone, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const services = [
  {
    icon: Palette,
    title: "Design sur-mesure",
    desc: "Une identité visuelle premium, pensée pour votre marque — pas un template recyclé.",
  },
  {
    icon: LineChart,
    title: "Intelligence intégrée",
    desc: "Tableau de bord analytique livré avec le site. Vos données, lisibles d'un coup d'œil.",
  },
  {
    icon: Gauge,
    title: "Performance extrême",
    desc: "Chargement sous la seconde, score Lighthouse au sommet. La vitesse, c'est de la conversion.",
  },
  {
    icon: Search,
    title: "SEO technique",
    desc: "Structure, vitesse et contenu optimisés pour être trouvé par les bons clients.",
  },
  {
    icon: Smartphone,
    title: "Responsive absolu",
    desc: "Une expérience irréprochable du mobile au grand écran, dans le moindre détail.",
  },
  {
    icon: Sparkles,
    title: "Motion & immersion",
    desc: "Animations 3D et micro-interactions qui marquent les esprits — comme cette porte.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary-glow))]">
          Ce qu'on fait
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl font-bold tracking-tight md:text-5xl">
          Le haut de gamme, <span className="font-serif-accent italic text-gradient-primary">augmenté par la data.</span>
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.08}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-border/70 bg-card/40 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="inline-flex rounded-2xl bg-primary/12 p-3 text-[hsl(var(--primary-glow))]">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
