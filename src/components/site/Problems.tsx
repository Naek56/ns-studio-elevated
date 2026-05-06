import { Clock, TrendingDown, Search, Users, AlertTriangle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    title: "Vous perdez des clients chaque jour",
    description: "Pendant que vos concurrents captent les recherches Google, votre site invisible vous fait passer à côté.",
  },
  {
    icon: Clock,
    title: "Un site qui vous fait perdre du temps",
    description: "Modifier un texte ou une image devient un casse-tête. Vous repoussez, et tout se dégrade.",
  },
  {
    icon: Search,
    title: "Aucune visibilité sur Google",
    description: "Sans SEO solide, votre site dort dans les pages oubliées. Zéro prospect entrant.",
  },
  {
    icon: Users,
    title: "Une image qui ne convertit pas",
    description: "Design daté, mobile illisible, lenteur : vos visiteurs partent avant même de vous lire.",
  },
  {
    icon: AlertTriangle,
    title: "Des prospects imprévisibles",
    description: "Vous dépendez du bouche-à-oreille. Aucun système clair pour faire venir des clients chaque mois.",
  },
  {
    icon: Wallet,
    title: "Des agences hors de prix",
    description: "Devis à 5 000 €+, délais à rallonge, et impossible de modifier une virgule sans payer.",
  },
];

const Problems = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="problems" className="relative py-24 md:py-32">
      <div className="container max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <span className="text-xs font-medium text-destructive uppercase tracking-wider">Le constat</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Vous reconnaissez-vous ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Chaque mois sans site performant, c'est des clients qui partent à la concurrence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group relative p-7 rounded-2xl glass hover:border-destructive/40 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <Button variant="hero" size="xl" onClick={() => scrollTo("booking")} className="group">
            Réserver mon audit gratuit
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            15 min · Sans engagement · Recommandations concrètes
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problems;
