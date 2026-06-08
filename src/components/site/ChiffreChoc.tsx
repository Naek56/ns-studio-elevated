import { motion } from "framer-motion";

export default function ChiffreChoc() {
  return (
    <section id="chiffre" className="relative flex min-h-screen items-center justify-center overflow-hidden border-t border-border/60">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" />
      <div className="container-tight relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-display text-[28vw] font-black leading-none tracking-tighter text-gradient-warm md:text-[22rem]"
        >
          97%
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-2 max-w-md text-lg text-muted-foreground"
        >
          des visiteurs quittent un site sans jamais revenir. Kairos vous dit pourquoi.
        </motion.p>
      </div>
    </section>
  );
}
