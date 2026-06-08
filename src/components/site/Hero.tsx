import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import WaveField from "./WaveField";

export default function Hero() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="ouverture" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fluid orange wave */}
      <WaveField className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />

      <div className="container-tight relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Veille active, en continu
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mx-auto mt-7 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        >
          Votre marché n'a
          <br />
          plus de <span className="text-gradient-warm">secrets.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Kairos surveille vos concurrents, vos clients et votre secteur. Vous recevez l'essentiel, au bon moment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button onClick={() => go("plans")} className="btn-primary group">
            Commencer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={() => go("plans")} className="btn-ghost">
            Voir les plans
          </button>
        </motion.div>
      </div>
    </section>
  );
}
