import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Footer from "./Footer";
import WordReveal from "./WordReveal";
import Parallax from "./Parallax";
import { openContact } from "./ContactModal";

export default function Contact() {
  return (
    <section id="contact" className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-black px-6 pt-32 pb-12 text-center">
      <Parallax speed={80} className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[70vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2">
        <div className="hero-glow h-full w-full" />
      </Parallax>

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

        <WordReveal
          text="Vous ne le regretterez pas."
          className="display-xl mt-6 max-w-3xl text-4xl font-semibold text-white sm:text-6xl md:text-7xl"
        />

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

      <Footer />
    </section>
  );
}
