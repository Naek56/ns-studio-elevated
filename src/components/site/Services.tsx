import { Code2, Gauge, Palette, Rocket, Search, Smartphone } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Design sur-mesure",
    description: "Identité visuelle unique, interfaces soignées, expérience pensée pour vos visiteurs.",
  },
  {
    icon: Code2,
    title: "Développement premium",
    description: "Code propre, modulable et maintenable. Aucune limite technique.",
  },
  {
    icon: Gauge,
    title: "Performance extrême",
    description: "Sites optimisés pour la vitesse. Score Lighthouse 95+ garanti.",
  },
  {
    icon: Smartphone,
    title: "100% Responsive",
    description: "Une expérience parfaite sur mobile, tablette et desktop.",
  },
  {
    icon: Search,
    title: "SEO intégré",
    description: "Structure optimisée pour Google. Indexation rapide, balises propres.",
  },
  {
    icon: Rocket,
    title: "Mise en ligne rapide",
    description: "De la maquette au déploiement en quelques semaines, sans compromis.",
  },
];

const Services = () => {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Services</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Tout ce qu'il faut pour briller en ligne
          </h2>
          <p className="text-muted-foreground text-lg">
            Une approche complète, de la stratégie au pixel près.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative p-7 rounded-2xl glass hover:border-primary/40 transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:shadow-glow-sm transition-all duration-500">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
