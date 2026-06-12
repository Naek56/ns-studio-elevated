import { motion } from "framer-motion";
import Reveal from "./Reveal";

const traits = [
  { t: "Observe", d: "Votre marché, vos concurrents, vos clients. En continu." },
  { t: "Comprend", d: "Au delà des chiffres, le sens et les signaux faibles." },
  { t: "Anticipe", d: "Ce qui arrive, avant que ça n'arrive." },
];

export default function Kairos() {
  return (
    <section id="kairos" className="section min-h-screen flex items-center">
      <div className="container-tight text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-xs uppercase tracking-[0.45em] text-muted-foreground"
        >
          Notre intelligence
        </motion.p>

        <Reveal>
          <h2 className="display-xl mx-auto mt-8 max-w-4xl text-balance text-4xl sm:text-6xl md:text-7xl">
            Nous avons créé <span className="italic">Kairos.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
            Une intelligence artificielle qui voit ce que vos concurrents voient déjà. Et bien plus encore.
          </p>
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {traits.map((t, i) => (
            <Reveal key={t.t} delay={i * 0.1}>
              <div className="h-full glass-mono p-8 text-left">
                <h3 className="font-display text-xl font-bold tracking-tight">{t.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
