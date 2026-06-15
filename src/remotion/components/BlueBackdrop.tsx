import { type FC } from "react";
import { AbsoluteFill } from "remotion";
import { withAlpha } from "../color";

const INDIGO = "#1e3a8a";

type BlueBackdropProps = {
  frame: number;
  /** 0 at the top of the descent, 1 at the bottom. */
  descent: number;
  accent: string;
};

/**
 * Black base with drifting blue gradients — the "contraste dégradé bleu". The
 * glows track the descent (parallax) and breathe slowly over time, and a
 * vignette deepens the edges back to pure black.
 */
export const BlueBackdrop: FC<BlueBackdropProps> = ({ frame, descent, accent }) => {
  const t = frame / 30;
  const glowA = 26 + descent * 46 + Math.sin(t * 0.6) * 4;
  const glowB = 72 - descent * 40 + Math.cos(t * 0.5) * 5;
  const driftX = 44 + Math.sin(t * 0.4) * 7;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 48% at 50% ${glowA}%, ${withAlpha(accent, 0.32)}, transparent 64%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 42% at ${driftX}% ${glowB}%, ${withAlpha(INDIGO, 0.42)}, transparent 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 40% at ${100 - driftX}% ${glowA + 8}%, ${withAlpha(accent, 0.16)}, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${withAlpha("#0a1430", 0.5)} 0%, transparent 28%, transparent 72%, ${withAlpha("#070d20", 0.62)} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(125% 95% at 50% 50%, transparent 52%, rgba(0,0,0,0.72) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
