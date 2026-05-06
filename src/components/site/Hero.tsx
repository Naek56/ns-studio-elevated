import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 text-center max-w-5xl">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Sites web premium qui convertissent</span>
        </div>

        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <span className="text-gradient">Pendant que vos</span>
          <br />
          <span className="text-gradient">concurrents grandissent,</span>
          <br />
          <span className="text-gradient-primary">vous perdez des clients.</span>
        </h1>

        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          NS Studio conçoit des sites web premium qui transforment vos visiteurs en clients. Plus de prospects, plus de réservations, plus de chiffre d'affaires — sans que vous ayez à toucher à quoi que ce soit.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.55s" }}
        >
          <Button variant="hero" size="xl" onClick={() => scrollTo("booking")} className="group">
            Réserver mon audit gratuit
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="ghost-bordered" size="xl" onClick={() => scrollTo("services")}>
            Voir comment on fait
          </Button>
        </div>

        <p
          className="text-xs text-muted-foreground mt-5 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.65s" }}
        >
          ✦ 15 minutes · 100% gratuit · Sans engagement
        </p>

        <div
          className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          {[
            { value: "+180%", label: "de prospects en moyenne" },
            { value: "<2s", label: "Temps de chargement" },
            { value: "98+", label: "Score Lighthouse" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-gradient-primary">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Hero;
