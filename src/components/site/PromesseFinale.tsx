import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PromesseFinale() {
  return (
    <section id="promesse" className="relative flex min-h-screen items-center justify-center overflow-hidden border-t border-border/60">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[50vmin] w-[80vmin] -translate-x-1/2 translate-y-1/3 rounded-full bg-primary/20 blur-[130px]" />
      <div className="container-tight relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
        >
          Arrêtez de deviner.
          <br />
          Commencez à <span className="text-gradient-warm">savoir.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10"
        >
          <a href="mailto:hello@nsintelligence.com" className="btn-liquid-accent group mx-auto text-base">
            Activer ma veille
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
