import { motion } from "framer-motion";
import HandsScene from "@/components/three/HandsScene";

export default function Hero() {
  return (
    <section id="accueil" className="bg-aurora relative flex min-h-screen flex-col overflow-hidden">
      {/* animated hands (continuous, no scroll needed) */}
      <div className="absolute inset-0">
        <HandsScene />
      </div>

      {/* centered statement */}
      <div className="container-tight relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-xs uppercase tracking-[0.4em] text-muted-foreground"
        >
          WAY Agency
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 0.8, 0.3, 1] }}
          className="display-xl max-w-4xl text-balance text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Votre concurrent sait ce qui se passe sur son site.
          <span className="mt-2 block text-blue">Et vous ?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-7 max-w-md text-base text-muted-foreground"
        >
          Studio créatif et intelligence. Là où l'humain rencontre la machine.
        </motion.p>
      </div>

      {/* category chips, echoing the reference */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 mb-12 flex flex-wrap items-center justify-center gap-3 px-4"
      >
        {["Design", "Expérience", "Intelligence"].map((c) => (
          <span key={c} className="btn-glass cursor-default text-sm">
            {c}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
