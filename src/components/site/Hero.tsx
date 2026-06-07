import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 * i, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

export default function Hero() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <motion.span
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-xs font-medium text-foreground/80"
      >
        <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary-glow))]" />
        Agence de sites web haut de gamme &amp; pilotés par la data
      </motion.span>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-8 max-w-5xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Vos concurrents savent ce qui se passe sur leurs sites.
        <br />
        <span className="font-serif-accent text-5xl font-normal italic text-gradient-primary sm:text-6xl md:text-7xl lg:text-8xl">
          Et&nbsp;vous&nbsp;?
        </span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mx-auto mt-7 max-w-2xl text-base text-muted-foreground md:text-lg"
      >
        NS Intelligence conçoit des sites premium, rapides et élégants — équipés d'une couche
        d'analyse en temps réel. Vous ne livrez plus un site, vous pilotez un actif qui convertit.
      </motion.p>

      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <LiquidButton size="lg" variant="primary" onClick={() => go("contact")} className="group">
          Démarrer un projet
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </LiquidButton>
        <LiquidButton size="lg" variant="glass" onClick={() => go("realisations")}>
          Voir nos réalisations
        </LiquidButton>
      </motion.div>

      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-4"
      >
        {[
          { k: "+213%", v: "de conversions en moyenne" },
          { k: "<1s", v: "temps de chargement" },
          { k: "24/7", v: "données en temps réel" },
        ].map((s) => (
          <div key={s.v} className="rounded-2xl liquid-glass px-3 py-4">
            <div className="font-display text-2xl font-bold text-gradient-primary md:text-3xl">{s.k}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 inline-flex items-center gap-2 text-xs text-muted-foreground/80"
      >
        <Activity className="h-3.5 w-3.5 text-[hsl(var(--primary-glow))]" />
        Chaque pixel mesuré. Chaque visiteur compris.
      </motion.div>
    </section>
  );
}
