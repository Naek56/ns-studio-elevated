import { Check, Sparkles, Rocket, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    icon: Sparkles,
    name: "Vitrine",
    price: "350€",
    tagline: "Site one-page élégant",
    description: "Idéal pour présenter votre activité, freelance ou petit business.",
    features: [
      "Site one-page sur-mesure",
      "Design unique & responsive",
      "Formulaire de contact",
      "SEO de base inclus",
      "Mise en ligne incluse",
    ],
    highlighted: false,
  },
  {
    icon: Rocket,
    name: "Pro",
    price: "750€",
    tagline: "Site multi-pages complet",
    description: "Pour les entreprises qui veulent une vraie présence en ligne.",
    features: [
      "Jusqu'à 5 pages personnalisées",
      "Design premium & animations",
      "Blog ou portfolio inclus",
      "SEO avancé + Google Analytics",
      "Formulaires & intégrations",
      "1 mois de modifications offert",
    ],
    highlighted: true,
  },
  {
    icon: Crown,
    name: "Sur-mesure",
    price: "Sur devis",
    tagline: "E-commerce & projets complexes",
    description: "Boutique en ligne, plateforme web, application sur-mesure.",
    features: [
      "Pages illimitées",
      "E-commerce / espace membre",
      "Base de données & back-office",
      "Intégrations API personnalisées",
      "Suivi & maintenance dédiés",
      "Accompagnement stratégique",
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  const scrollToBooking = (planName: string) => {
    sessionStorage.setItem("selectedPlan", planName);
    window.dispatchEvent(new CustomEvent("plan-selected", { detail: planName }));
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="container max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Tarifs</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Des prix clairs, sans surprise
          </h2>
          <p className="text-muted-foreground text-lg">
            Choisissez la formule qui correspond à votre projet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`group relative p-8 rounded-2xl glass transition-all duration-500 hover:-translate-y-1 flex flex-col ${
                  plan.highlighted
                    ? "border-primary/60 shadow-glow-sm"
                    : "hover:border-primary/40"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
                    Populaire
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.tagline}</p>
                <div className="mb-4">
                  <span className="font-display text-4xl font-bold text-gradient">{plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "hero" : "outline"}
                  className="w-full"
                  onClick={scrollToBooking}
                >
                  Choisir cette offre
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Tous nos sites incluent l'hébergement, le HTTPS et un design responsive.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
