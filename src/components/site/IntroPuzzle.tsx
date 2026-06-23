import { useEffect, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";

const SIZE = 220;

export default function IntroPuzzle({ onComplete }: { onComplete: () => void }) {
  const [start] = useState(() => {
    const small = typeof window !== "undefined" && window.innerWidth < 640;
    return small ? { x: 125, y: 150 } : { x: 240, y: 130 };
  });

  const x = useMotionValue(start.x);
  const y = useMotionValue(start.y);
  const [near, setNear] = useState(false);
  const [solved, setSolved] = useState(false);

  // distance-driven helpers
  const dist = () => Math.hypot(x.get(), y.get());

  const onDrag = () => setNear(dist() < 64);
  const onDragEnd = () => {
    if (dist() < 64) {
      animate(x, 0, { type: "spring", stiffness: 320, damping: 22 });
      animate(y, 0, { type: "spring", stiffness: 320, damping: 22, onComplete: () => setSolved(true) });
      setNear(true);
    } else {
      animate(x, start.x, { type: "spring", stiffness: 200, damping: 24 });
      animate(y, start.y, { type: "spring", stiffness: 200, damping: 24 });
      setNear(false);
    }
  };

  useEffect(() => {
    if (!solved) return;
    const t = setTimeout(onComplete, 1700);
    return () => clearTimeout(t);
  }, [solved, onComplete]);

  // the ring lights up as the W gets closer
  const ringOpacity = useTransform([x, y], ([vx, vy]: number[]) => {
    const d = Math.hypot(vx, vy);
    return 0.32 + Math.max(0, 1 - d / 260) * 0.68;
  });

  const lit = near || solved;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.12, filter: "blur(6px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* soft white light */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.16), transparent 70%)", filter: "blur(30px)" }}
        animate={{ opacity: solved ? 0.9 : 0.5, scale: solved ? 1.2 : 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* instruction */}
      <motion.div
        className="absolute top-[16%] px-6 text-center"
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className="label">WAY Creative Agency</p>
        <p className="mt-4 text-base text-white/70 sm:text-lg">
          {solved ? "Bienvenue." : "Reconstituez le logo — glissez le W dans le cercle."}
        </p>
      </motion.div>

      {/* puzzle stage */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* success burst */}
        {solved && (
          <motion.div
            className="absolute left-1/2 top-1/2 rounded-full border border-white/60"
            style={{ width: SIZE, height: SIZE, x: "-50%", y: "-50%" }}
            initial={{ scale: 0.6, opacity: 0.7 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}

        {/* the ring (target) */}
        <motion.svg
          viewBox="0 0 48 48"
          className="absolute inset-0 h-full w-full"
          fill="none"
          animate={{ scale: solved ? [1, 1.12, 1] : 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.circle
            cx="24" cy="24" r="22"
            stroke="#fff"
            strokeWidth="1.6"
            style={{ opacity: solved ? 1 : ringOpacity, filter: lit ? "drop-shadow(0 0 6px rgba(255,255,255,0.8))" : "none" }}
          />
        </motion.svg>

        {/* the draggable W */}
        <motion.svg
          viewBox="0 0 48 48"
          className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
          fill="none"
          drag={!solved}
          dragMomentum={false}
          style={{ x, y }}
          whileDrag={{ scale: 1.06 }}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        >
          <motion.path
            d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ filter: lit ? "drop-shadow(0 0 8px rgba(255,255,255,0.9))" : "drop-shadow(0 0 0 rgba(255,255,255,0))" }}
          />
        </motion.svg>
      </div>

      {/* hint */}
      {!solved && (
        <motion.p
          className="absolute bottom-[14%] text-xs uppercase tracking-[0.3em] text-white/35"
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Glissez le W
        </motion.p>
      )}
    </motion.div>
  );
}
