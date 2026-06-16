import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="accueil" className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="container-tight relative z-10 text-center">
        <div className="rounded-3xl border border-white/10 bg-background/40 p-6 backdrop-blur-sm lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="legible mb-7 text-xs uppercase tracking-[0.45em] text-muted-foreground"
        >
          WAY Agency
        </motion.p>

        <h1 className="text-scrim relative display-xl mx-auto max-w-4xl text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          {["Votre concurrent sait", "ce qui se passe sur son site."].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease: [0.16, 0.8, 0.3, 1] }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-2 block italic text-muted-foreground"
          >
            Et vous ?
          </motion.span>
        </h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-12 hidden flex-col items-center gap-2 text-muted-foreground lg:flex"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.35em]">Défiler</span>
          <motion.span
            animate={{ height: [10, 26, 10] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px bg-white/40"
          />
        </motion.div>
      </div>
    </section>
  );
}
