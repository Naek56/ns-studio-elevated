import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Stratégie",
    description: "Appel découverte de 15 min. On analyse votre marché, vos concurrents et on définit une stratégie claire pour transformer vos visiteurs en clients.",
  },
  {
    num: "02",
    title: "Exécution",
    description: "On conçoit et développe votre site premium en 2 à 4 semaines. Design sur-mesure, SEO, performance, conversion : tout est optimisé.",
  },
  {
    num: "03",
    title: "Croissance",
    description: "Mise en ligne, suivi et modifications sous 48h à vie. Vous voyez vos prospects et votre chiffre d'affaires augmenter mois après mois.",
  },
];

const Process = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="process" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Process</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
            3 étapes. Zéro prise de tête.
          </h2>
          <p className="text-muted-foreground text-lg">
            Un process simple, transparent, axé résultats.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative group">
              <div className="relative p-7 rounded-2xl glass h-full hover:border-primary/40 transition-all duration-500">
                <div className="font-display text-5xl font-bold text-gradient-primary mb-4 opacity-80">
                  {step.num}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button variant="hero" size="xl" onClick={() => scrollTo("booking")} className="group">
            Démarrer maintenant
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Process;
