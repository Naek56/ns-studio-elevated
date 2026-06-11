import { motion } from "framer-motion";

export default function Manifesto() {
  const words = ["Voir", "avant", "les", "autres.", "Voilà", "tout."];
  return (
    <section className="section">
      <div className="container-tight">
        <p className="mb-10 text-xs uppercase tracking-[0.4em] text-muted-foreground">Le constat</p>
        <h2 className="display-xl max-w-4xl text-balance text-4xl sm:text-5xl md:text-6xl">
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
          className="mt-10 max-w-md text-lg text-muted-foreground"
        >
          La plupart des marques avancent à l'aveugle. Nous, nous regardons. Et nous transformons ce que nous voyons en avance.
        </motion.p>
      </div>
    </section>
  );
}
