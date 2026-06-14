import { motion } from "framer-motion";
import Cta from "./Cta";

export default function Manifesto() {
  const words = ["Voir", "avant", "les", "autres.", "Voilà", "tout."];
  return (
    <section id="manifeste" className="relative flex min-h-screen items-center">
      <div className="container-tight">
        <div className="w-[54%] mr-auto">
          <p className="legible mb-4 text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground sm:mb-6 sm:text-xs">Le constat</p>
          <h2 className="display-xl text-balance text-2xl sm:text-3xl md:text-4xl lg:text-6xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={i > 3 ? "text-muted-foreground" : ""}
              >
                {w}{" "}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="legible mt-5 max-w-md text-xs text-muted-foreground sm:text-sm lg:text-lg"
          >
            La plupart des marques avancent à l'aveugle. Nous, nous regardons. Et nous transformons ce que nous voyons en avance.
          </motion.p>
          <Cta label="Voir ce qu'on peut faire" />
        </div>
      </div>
    </section>
  );
}
