import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ChiffreChoc() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 1.25]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden border-t border-border/60"
    >
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]"
      />
      <div className="container-tight relative text-center">
        <motion.div
          style={{ scale, y }}
          className="font-display text-[30vw] font-extrabold leading-none tracking-tighter text-gradient-warm md:text-[24rem]"
        >
          97%
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-2 max-w-md text-lg text-muted-foreground"
        >
          des visiteurs quittent un site sans jamais revenir. Kairos vous dit pourquoi.
        </motion.p>
      </div>
    </section>
  );
}
