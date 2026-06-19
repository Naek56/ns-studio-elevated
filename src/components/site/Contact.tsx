import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import LogoParticles from "./LogoParticles";

export default function Contact() {
  return (
    <section id="contact" className="relative flex min-h-screen flex-col justify-between border-t border-white/5 pt-28 pb-16">
      <div className="container-tight flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="label"
        >
          Prenons de l'avance
        </motion.p>

        <LogoParticles className="my-6 h-[min(360px,68vw)] w-[min(360px,68vw)]" />

        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl max-w-3xl text-balance text-5xl sm:text-6xl md:text-7xl"
        >
          Construisons votre avance.
        </motion.h2>

        <motion.a
          href="mailto:hello@wayagency.fr"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="btn-line group mt-10 text-base"
        >
          Nous écrire
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.a>
      </div>

      <footer className="container-wide flex flex-col items-center justify-between gap-6 border-t border-border pt-10 sm:flex-row">
        <Logo />
        <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} WAY Creative Agency</p>
      </footer>
    </section>
  );
}
