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

      <div className="container relative z-10 text-center max-w-5xl">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Studio de création web premium</span>
        </div>

        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <span className="text-gradient">Votre vision,</span>
          <br />
          <span className="text-gradient">notre </span>
          <span className="text-gradient-primary">expertise.</span>
        </h1>

        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          NS Studio conçoit et gère des sites web premium pour vous. Votre site reste à votre nom, et nous nous occupons des modifications dès que vous en avez besoin.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.55s" }}
        >
          <Button variant="hero" size="xl" onClick={() => scrollTo("booking")} className="group">
            Réserver un appel
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="ghost-bordered" size="xl" onClick={() => scrollTo("services")}>
            Découvrir nos services
          </Button>
        </div>

        <div
          className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          {[
            { value: "100%", label: "Sur-mesure" },
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-border/60 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
