import { type FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSyne } from "@remotion/google-fonts/Syne";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Eclipse } from "./components/Eclipse";
import { type WayPromoProps } from "./types";

const { fontFamily: syne } = loadSyne("normal", { weights: ["700", "800"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500"] });

/** Opacity envelope: fade in over [a,b], hold, fade out over [c,d]. */
const band = (frame: number, a: number, b: number, c: number, d: number): number =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** A few px of upward drift as an element enters. */
const rise = (frame: number, start: number, end: number, distance = 32): number =>
  interpolate(frame, [start, end], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const centeredLayer: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "0 8%",
};

/**
 * WAY Agency promo — black & white, dramatic, narrated through an eclipse.
 * 1920×1080, 30fps, 9s.
 */
export const WayPromo: FC<WayPromoProps> = ({
  kicker,
  title,
  tagline,
  intelligence,
  closing,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Master fade so the film opens from and resolves to black.
  const master =
    interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }) *
    interpolate(frame, [durationInFrames - 22, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
    });

  // Eclipse settles in, then its bloom swells toward the closing statement.
  const settle = spring({ frame, fps, durationInFrames: 80, config: { damping: 200 } });
  const bloom = interpolate(
    frame,
    [0, 60, 200, durationInFrames],
    [0.25, 1, 1, 1.7],
    { extrapolateRight: "clamp" },
  );

  // Title letter-spacing breathes inward as it arrives.
  const titleSpacing = interpolate(frame, [8, 46], [0.34, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", opacity: master }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 50% 38%, rgba(22,22,22,0.65) 0%, #000 70%)",
        }}
      />

      {/* Persistent eclipse symbol */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateY(${interpolate(settle, [0, 1], [70, -36])}px) scale(${interpolate(
              settle,
              [0, 1],
              [0.72, 1],
            )})`,
          }}
        >
          <Eclipse size={760} bloom={bloom} accent={accent} />
        </div>
      </AbsoluteFill>

      {/* Opening: kicker + WAY */}
      <AbsoluteFill style={{ ...centeredLayer, flexDirection: "column", opacity: band(frame, 8, 30, 116, 138) }}>
        <div
          style={{
            transform: `translateY(${rise(frame, 8, 38)}px)`,
            fontFamily: `${inter}, sans-serif`,
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            marginBottom: 28,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            transform: `translateY(${rise(frame, 8, 44, 48)}px)`,
            fontFamily: `${syne}, sans-serif`,
            fontWeight: 800,
            fontSize: 240,
            lineHeight: 1,
            letterSpacing: `${titleSpacing}em`,
            color: "#ffffff",
            textShadow: "0 0 60px rgba(255,255,255,0.18)",
          }}
        >
          {title}
        </div>
      </AbsoluteFill>

      {/* Tagline — the provocation */}
      <AbsoluteFill style={{ ...centeredLayer, opacity: band(frame, 70, 92, 162, 184) }}>
        <div
          style={{
            transform: `translateY(${rise(frame, 70, 100)}px)`,
            fontFamily: `${syne}, sans-serif`,
            fontWeight: 700,
            fontSize: 66,
            lineHeight: 1.18,
            maxWidth: 1380,
            color: "#ffffff",
          }}
        >
          {tagline}
        </div>
      </AbsoluteFill>

      {/* Kairos — the intelligence */}
      <AbsoluteFill style={{ ...centeredLayer, opacity: band(frame, 150, 172, 224, 246) }}>
        <div
          style={{
            transform: `translateY(${rise(frame, 150, 182)}px)`,
            fontFamily: `${inter}, sans-serif`,
            fontWeight: 400,
            fontSize: 42,
            lineHeight: 1.4,
            maxWidth: 1200,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {intelligence}
        </div>
      </AbsoluteFill>

      {/* Closing statement */}
      <AbsoluteFill style={{ ...centeredLayer, opacity: band(frame, 214, 240, durationInFrames, durationInFrames) }}>
        <div
          style={{
            transform: `translateY(${rise(frame, 214, 248)}px)`,
            fontFamily: `${syne}, sans-serif`,
            fontWeight: 800,
            fontSize: 100,
            lineHeight: 1.05,
            color: "#ffffff",
            textShadow: "0 0 80px rgba(255,255,255,0.22)",
          }}
        >
          {closing}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
