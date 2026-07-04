import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrance animation played every time a section comes into view while
 * scrolling. `plain` limits it to a fade (no transform) for sections that
 * rely on position: sticky, which transforms would break.
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
      initial={plain ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.985 }}
      whileInView={plain ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
