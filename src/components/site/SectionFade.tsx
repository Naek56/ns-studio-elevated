import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrance played when a section reaches the viewport: a clean curtain
 * reveal (the section un-masks from the center) with a slight rise.
 * `plain` limits it to a simple fade for sections relying on
 * position: sticky, which clip/transforms could disturb.
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
      initial={
        plain
          ? { opacity: 0 }
          : { opacity: 0, y: 32, clipPath: "inset(12% 8% 12% 8% round 28px)" }
      }
      whileInView={
        plain
          ? { opacity: 1 }
          : { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 0px)" }
      }
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
