import { ArrowRight } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-button";
import Reveal from "./Reveal";

export default function FinalCta() {
  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-6 py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-gradient-to-b from-primary/12 to-transparent px-8 py-16 text-center md:px-16 md:py-20">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-[120px]" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[hsl(36_100%_52%/0.2)] blur-[120px]" />

          <h2 className="relative font-display text-3xl font-bold tracking-tight md:text-5xl">
            Prêt à voir clair —<br />
            <span className="font-serif-accent italic text-gradient-primary">et à grandir&nbsp;?</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-muted-foreground">
            Réservez un échange de 20 minutes. On analyse votre présence actuelle et on vous montre,
            concrètement, ce qu'un site NS Intelligence changerait pour vous.
          </p>

          <div className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LiquidButton
              size="lg"
              variant="primary"
              asChild
              className="group"
            >
              <a href="mailto:hello@nsintelligence.com">
                Réserver mon audit gratuit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </LiquidButton>
            <LiquidButton size="lg" variant="glass" asChild>
              <a href="mailto:hello@nsintelligence.com">Écrire à l'équipe</a>
            </LiquidButton>
          </div>

          <p className="relative mt-5 text-xs text-muted-foreground">
            ✦ 20 minutes · 100 % gratuit · sans engagement
          </p>
        </div>
      </Reveal>
    </section>
  );
}
