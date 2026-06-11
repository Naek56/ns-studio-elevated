import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section id="accueil" className="relative flex min-h-screen flex-col">
      {/* top brand */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container-tight pt-8"
      >
        <Logo />
      </motion.div>

      {/* centered statement */}
      <div className="container-tight flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-7 text-xs uppercase tracking-[0.45em] text-muted-foreground"
        >
          WAY Agency
        </motion.p>

        <h1
          className="display-xl max-w-4xl text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.5)" }}
        >
          {["Votre concurrent sait", "ce qui se passe sur son site."].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45 + i * 0.12, ease: [0.16, 0.8, 0.3, 1] }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 0.8, 0.3, 1] }}
            className="mt-2 block italic text-muted-foreground"
          >
            Et vous ?
          </motion.span>
        </h1>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="flex flex-col items-center gap-2 pb-28 text-muted-foreground"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.35em]">Défiler</span>
        <motion.span
          animate={{ height: [10, 26, 10] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px bg-white/40"
        />
      </motion.div>
    </section>
  );
}
