import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { openContact } from "./ContactModal";

export default function Contact() {
  return (
    <section id="contact" className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-black px-6 pt-32 pb-12 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[70vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 hero-glow" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="label"
        >
          Parlons de votre projet
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl mt-6 max-w-3xl text-4xl font-semibold text-white sm:text-6xl md:text-7xl"
        >
          Vous ne le regretterez pas.
        </motion.h2>

        <motion.button
          onClick={openContact}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="btn-glass group mt-10 px-8 py-3.5 text-base"
        >
          Démarrer un projet
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.button>
      </div>

      <footer className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
        <Logo />
        <p className="text-xs text-white/40">© {new Date().getFullYear()} WAY Creative Agency</p>
      </footer>
    </section>
  );
}
