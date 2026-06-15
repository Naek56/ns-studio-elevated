import { type FC } from "react";

const hexToRgba = (hex: string, alpha: number): string => {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  if (full.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
  }
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type EclipseProps = {
  size: number;
  /** Intensity of the outer bloom / rim light (1 = nominal). */
  bloom: number;
  accent: string;
};

/**
 * Monochrome eclipse / planet with a luminous rim — the persistent background
 * symbol of the WAY Agency identity (echoes the site's R3F + bloom motif).
 */
export const Eclipse: FC<EclipseProps> = ({ size, bloom, accent }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 50% 42%, #161616 0%, #080808 55%, #000000 72%)",
        boxShadow: [
          // Crisp rim light hugging the edge
          `inset 0 0 0 1.5px ${hexToRgba(accent, 0.85)}`,
          // Soft catch light along the upper rim
          `inset 0 26px 90px -18px ${hexToRgba(accent, 0.2)}`,
          // Outer bloom radiating into the void
          `0 0 ${120 * bloom}px ${26 * bloom}px ${hexToRgba(accent, 0.1 * bloom)}`,
        ].join(", "),
      }}
    />
  );
};
