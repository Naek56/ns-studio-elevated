import { motion } from "framer-motion";
import Cta from "./Cta";

export default function Manifesto() {
  const words = ["Voir", "avant", "les", "autres.", "Voilà", "tout."];
  return (
    <section id="manifeste" className="relative flex min-h-screen flex-col justify-center">
      <div className="container-tight">
        <div className="w-full rounded-3xl border border-white/10 bg-background/40 p-6 backdrop-blur-sm lg:w-[54%] lg:mr-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <p className="legible mb-5 text-xs uppercase tracking-[0.35em] text-muted-foreground sm:text-sm">Le constat</p>
          <h2 className="display-xl text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
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
            className="legible mt-6 max-w-md text-sm text-muted-foreground sm:text-base lg:text-lg"
          >
            La plupart des marques avancent à l'aveugle. Nous, nous regardons. Et nous transformons ce que nous voyons en avance.
          </motion.p>
          <Cta label="Voir ce qu'on peut faire" />
        </div>
      </div>
    </section>
  );
}
