import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-linked parallax: the child drifts vertically (and optionally
 * scales) as its section crosses the viewport. Transform-only => GPU
 * cheap; disabled with prefers-reduced-motion.
 *
 * speed  > 0 : moves slower than the page (background feel)
 * speed  < 0 : moves against the scroll (foreground feel)
 */
export default function Parallax({
  children,
  speed = 60,
  zoom = 0,
  className,
}: {
  children: ReactNode;
  speed?: number;
  zoom?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1 + zoom, 1]);

  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ y, scale, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}
