import { Code2, Gauge, LifeBuoy, Palette, Search, Smartphone } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Plus de prospects qualifiés",
    description: "SEO intégré, structure pensée pour Google. Votre site devient une source régulière de demandes entrantes.",
  },
  {
    icon: Gauge,
    title: "Conversion maximisée",
    description: "Chaque pixel est pensé pour transformer vos visiteurs en clients. CTA stratégiques, parcours optimisé.",
  },
  {
    icon: Smartphone,
    title: "Crédibilité instantanée",
    description: "Un site premium qui rassure. Vos visiteurs vous prennent au sérieux dès la première seconde.",
  },
  {
    icon: Code2,
    title: "Performance extrême",
    description: "Chargement < 2s, score Lighthouse 95+. Google adore, vos visiteurs aussi.",
  },
  {
    icon: Palette,
    title: "Identité unique",
    description: "Design sur-mesure aligné à votre marque. Vous vous démarquez vraiment de la concurrence.",
  },
  {
    icon: LifeBuoy,
    title: "Vous ne touchez à rien",
    description: "On gère hébergement, mises à jour et modifications sous 48h. Vous restez focus sur votre business.",
  },
];

const Services = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Ce que vous gagnez</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Un site qui travaille pour vous, 24h/24
          </h2>
          <p className="text-muted-foreground text-lg">
            Pas juste une vitrine. Une vraie machine à clients.
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
