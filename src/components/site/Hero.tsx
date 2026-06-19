import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LogoParticles from "./LogoParticles";

const WORDS = ["AVEUGLE", "MUET", "SEUL", "PERDU"];

export default function Hero() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setW((v) => (v + 1) % WORDS.length), 2000);
    return () => window.clearInterval(id);
  }, []);

  const go = (id: string) => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: string) => void } }).lenis;
    if (lenis) lenis.scrollTo("#" + id);
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="accueil" className="relative flex min-h-screen flex-col items-center justify-center py-28 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="label mb-10"
      >
        WAY Creative Agency
      </motion.p>

      <h1 className="display-xl px-6 text-foreground" style={{ fontSize: "clamp(56px, 8vw, 110px)" }}>
        <span className="block font-light">Votre site est</span>
        <span className="block h-[1.1em] font-light italic" style={{ color: "rgba(255,255,255,0.78)" }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={WORDS[w]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              {WORDS[w]}
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>

      <LogoParticles className="my-6 h-[min(400px,72vw)] w-[min(400px,72vw)]" />

      <p className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
        Kairos change ça.
      </p>

      <button onClick={() => go("kairos")} className="btn-glass group mt-8">
        Découvrir Kairos
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </section>
  );
}
