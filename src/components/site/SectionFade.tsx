import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrance animation played every time a section comes into view while
 * scrolling — a soft rise + blur-in for a premium, cinematic feel.
 * `plain` limits it to a fade/blur (no transform) for sections that rely on
 * position: sticky, which transforms would break.
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
      initial={plain ? { opacity: 0, filter: "blur(10px)" } : { opacity: 0, y: 80, scale: 0.98, filter: "blur(14px)" }}
      whileInView={plain ? { opacity: 1, filter: "blur(0px)" } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
