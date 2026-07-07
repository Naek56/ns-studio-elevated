import { motion, useReducedMotion } from "framer-motion";

/**
 * Cinematic heading: each word rises out of its own mask, staggered.
 * Pure transform/opacity — cheap on mobile. Falls back to a plain
 * fade when the user prefers reduced motion.
 */
export default function WordReveal({
  text,
  className,
  style,
  as: Tag = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag];

  if (reduced) {
    return (
      <MotionTag
        className={className}
        style={style}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        {text}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%", rotate: 2.5, opacity: 0 },
              show: {
                y: "0%",
                rotate: 0,
                opacity: 1,
                transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && <span aria-hidden>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
