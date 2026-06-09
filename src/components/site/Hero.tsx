import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import WaveField from "./WaveField";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const waveY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <motion.div style={{ y: waveY }} className="absolute inset-0">
        <WaveField className="h-full w-full" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-tight relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Kairos, par NS Intelligence
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mx-auto mt-7 max-w-4xl font-display text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl md:text-7xl"
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
          <button onClick={() => go("plans")} className="btn-liquid-accent group">
            Commencer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={() => go("modules")} className="btn-liquid">
            Découvrir
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-9 w-5 rounded-full border border-white/20 p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-full rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
