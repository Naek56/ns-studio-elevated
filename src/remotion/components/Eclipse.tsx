import { type FC } from "react";
import { withAlpha } from "../color";

type EclipseProps = {
  size: number;
  /** Intensity of the outer bloom / rim light (1 = nominal). */
  bloom: number;
  accent: string;
};

/**
 * Monochrome eclipse / planet with a luminous rim — the persistent background
 * symbol of the WAY Agency identity (echoes the site's R3F + bloom motif). The
 * rim and bloom take the accent colour, so a blue accent gives a blue eclipse.
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
          `inset 0 0 0 1.5px ${withAlpha(accent, 0.85)}`,
          // Soft catch light along the upper rim
          `inset 0 26px 90px -18px ${withAlpha(accent, 0.2)}`,
          // Outer bloom radiating into the void
          `0 0 ${120 * bloom}px ${26 * bloom}px ${withAlpha(accent, 0.1 * bloom)}`,
        ].join(", "),
      }}
    />
  );
};
