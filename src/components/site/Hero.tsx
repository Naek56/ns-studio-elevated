import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
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

      <h1 className="display-xl legible px-6 text-foreground" style={{ fontSize: "clamp(48px, 7.5vw, 104px)" }}>
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          On construit votre site.
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="block italic"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          Kairos le fait performer.
        </motion.span>
      </h1>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        onClick={() => go("kairos")}
        className="btn-glass group mt-12"
      >
        Découvrir Kairos
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </section>
  );
}
