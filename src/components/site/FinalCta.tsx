import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const FinalCta = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[140px]" />
      <div className="container relative z-10 max-w-4xl">
        <div className="relative p-10 md:p-16 rounded-3xl glass text-center border-primary/30">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Dernière étape
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-gradient leading-tight">
            Prêt à transformer votre site en machine à clients&nbsp;?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Réservez un appel gratuit de 15 minutes. On audite votre présence en
            ligne et on vous montre comment doubler vos prospects.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-sm text-muted-foreground">
            {["100% gratuit", "Sans engagement", "Réponse sous 24h"].map((b) => (
              <div key={b} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <Button
            variant="hero"
            size="xl"
            onClick={() => scrollTo("booking")}
            className="group"
          >
            Réserver mon appel gratuit
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Places limitées · 3 créneaux disponibles cette semaine
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
