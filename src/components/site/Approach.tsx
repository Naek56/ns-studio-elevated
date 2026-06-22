import { motion } from "framer-motion";

const ACCENT = "#8C9EFF";
const MONO = "'DM Mono', ui-monospace, monospace";

type Block = {
  n: string;
  title: string;
  desc: string;
  featured?: boolean;
};

const blocks: Block[] = [
  { n: "01", title: "Design", desc: "Des interfaces épurées, pensées pour mettre en valeur l'essentiel." },
  { n: "02", title: "Performance", desc: "Des sites rapides, fluides et optimisés sur tous les écrans." },
  {
    n: "03",
    title: "Kairos",
    desc: "Une intelligence qui observe votre marché et anticipe vos visiteurs.",
    featured: true,
  },
];

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Approach() {
  return (
    <section id="approche" className="relative py-24 md:py-36" style={{ background: "#0A0A0A" }}>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[18ch] px-6 text-left text-white md:px-12"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(48px, 7vw, 96px)",
          lineHeight: 1.05,
        }}
      >
        On construit des sites qui marquent et qui performent.
      </motion.h2>

      <div className="mt-16 flex w-full flex-col md:mt-24 md:flex-row md:items-stretch">
        {blocks.map((b, i) => (
          <motion.div
            key={b.n}
            custom={i}
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className={[
              "group flex-1 border-white/10 p-12 transition-colors duration-300",
              i > 0 ? "border-t md:border-l md:border-t-0" : "",
            ].join(" ")}
            style={{ background: b.featured ? "rgba(255,255,255,0.03)" : "transparent" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = b.featured
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = b.featured
                ? "rgba(255,255,255,0.03)"
                : "transparent";
            }}
          >
            <span
              className="block uppercase"
              style={{
                fontFamily: MONO,
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: b.featured ? ACCENT : "rgba(255,255,255,0.3)",
              }}
            >
              {b.n}
            </span>

            <div className="mt-5 flex items-center gap-3">
              <h3 className="text-white" style={{ fontSize: "24px", fontWeight: 600 }}>
                {b.title}
              </h3>
              {b.featured && (
                <span
                  className="uppercase"
                  style={{
                    fontFamily: MONO,
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    color: ACCENT,
                    border: `1px solid ${ACCENT}`,
                    borderRadius: "20px",
                    padding: "2px 8px",
                  }}
                >
                  Exclusif
                </span>
              )}
            </div>

            <span
              className="block"
              style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.2)", margin: "16px 0" }}
            />

            <p
              style={{
                fontFamily: MONO,
                fontSize: "12px",
                lineHeight: 1.8,
                color: b.featured ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)",
              }}
            >
              {b.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
