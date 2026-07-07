import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Section entrance: a buttery, organic rise on a soft spring (no bezier
 * cut-off, no blur) — the section glides up and settles naturally while
 * the opacity eases in. `plain` = fade only, for sticky sections.
 */
export default function SectionFade({
  children,
  plain = false,
  amount = 0.15,
}: {
  children: ReactNode;
  plain?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      style={{ willChange: "transform, opacity" }}
      initial={plain ? { opacity: 0 } : { opacity: 0, y: 110 }}
      whileInView={plain ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={
        plain
          ? { duration: 1.1, ease: "easeOut" }
          : {
              y: { type: "spring", stiffness: 52, damping: 17, mass: 1.1 },
              opacity: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] },
            }
      }
    >
      {children}
    </motion.div>
  );
}
