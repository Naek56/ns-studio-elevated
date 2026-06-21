import { type CSSProperties, type FC } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSyne } from "@remotion/google-fonts/Syne";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Eclipse } from "./components/Eclipse";
import { BlueBackdrop } from "./components/BlueBackdrop";
import { withAlpha } from "./color";
import { HOLD, L, MOVE, N, SCENES, VH, VW, type Scene } from "./wayMotion.data";
import { type WayMotionProps } from "./types";

const { fontFamily: syne } = loadSyne("normal", { weights: ["700", "800"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500"] });

// Smooth easings — strong in/out for the camera, expo-out for entrances.
const EASE_CAM = Easing.bezier(0.76, 0, 0.24, 1);
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
const LIGHT = "#a9c7ff";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const WayMotion: FC<WayMotionProps> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Open from / resolve to black.
  const master =
    interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }) *
    interpolate(frame, [durationInFrames - 28, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
    });

  // Camera: hold on each scene, then glide down to the next.
  const camFrames: number[] = [];
  const camYs: number[] = [];
  for (let i = 0; i < N; i++) {
    camFrames.push(i * L, i * L + HOLD);
    camYs.push(-i * VH, -i * VH);
  }
  const camY = interpolate(frame, camFrames, camYs, { easing: EASE_CAM, ...clamp });
  const descent = N > 1 ? -camY / ((N - 1) * VH) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", opacity: master }}>
      <BlueBackdrop frame={frame} descent={descent} accent={accent} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${camY}px)` }}>
        {SCENES.map((scene, i) => (
          <div
            key={i}
            style={{ position: "absolute", top: i * VH, left: 0, width: VW, height: VH }}
          >
            <SceneView scene={scene} index={i} frame={frame} accent={accent} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SceneView: FC<{ scene: Scene; index: number; frame: number; accent: string }> = ({
  scene,
  index,
  frame,
  accent,
}) => {
  const center = index * L;
  const isFirst = index === 0;
  const isLast = index === N - 1;

  // Focus-pull: each scene resolves as it centers, softens as it leaves.
  const enter = interpolate(
    frame,
    isFirst ? [6, 36] : [center - MOVE, center + 6],
    [0, 1],
    { easing: EASE_OUT, ...clamp },
  );
  const leaveStart = center + HOLD;
  const leave = isLast
    ? 1
    : interpolate(frame, [leaveStart, leaveStart + MOVE], [1, 0], { easing: EASE_IN, ...clamp });

  const presence = enter * leave;
  const blurPx = Math.max(1 - enter, isLast ? 0 : 1 - leave) * 12;
  const ty = (1 - enter) * 28 - (isLast ? 0 : (1 - leave) * 24);
  const scale = 1 + (1 - enter) * 0.06 - (isLast ? 0 : (1 - leave) * 0.03);

  const wrap: CSSProperties = {
    opacity: presence,
    transform: `translateY(${ty}px) scale(${scale})`,
    filter: blurPx > 0.05 ? `blur(${blurPx}px)` : undefined,
    willChange: "transform, opacity, filter",
  };

  if (scene.kind === "logo") {
    return (
      <LogoScene
        scene={scene}
        wrap={wrap}
        presence={presence}
        enter={enter}
        frame={frame}
        center={center}
        accent={accent}
      />
    );
  }
  return <LineScene scene={scene} wrap={wrap} frame={frame} center={center} accent={accent} />;
};

const LineScene: FC<{
  scene: Extract<Scene, { kind: "line" }>;
  wrap: CSSProperties;
  frame: number;
  center: number;
  accent: string;
}> = ({ scene, wrap, frame, center, accent }) => {
  const underline = interpolate(frame, [center - 4, center + 20], [0, 1], {
    easing: EASE_OUT,
    ...clamp,
  });
  const emph = !!scene.emphasis;

  const textStyle: CSSProperties = emph
    ? {
        backgroundImage: `linear-gradient(174deg, #ffffff 0%, ${LIGHT} 50%, ${accent} 100%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        filter: `drop-shadow(0 8px 40px ${withAlpha(accent, 0.45)})`,
      }
    : { color: "#E9F0FF", textShadow: `0 6px 34px ${withAlpha(accent, 0.3)}` };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 9%",
      }}
    >
      <div style={wrap}>
        <div
          style={{
            fontFamily: `${syne}, sans-serif`,
            fontWeight: emph ? 800 : 700,
            fontSize: scene.size,
            lineHeight: 1.12,
            letterSpacing: emph ? "-0.015em" : "-0.005em",
            maxWidth: 1480,
            margin: "0 auto",
            ...textStyle,
          }}
        >
          {scene.text}
        </div>
        <div
          style={{
            margin: "44px auto 0",
            height: 2,
            width: 220,
            transformOrigin: "center",
            transform: `scaleX(${underline})`,
            background: `linear-gradient(90deg, transparent, ${accent}, ${LIGHT}, transparent)`,
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
};

const LogoScene: FC<{
  scene: Extract<Scene, { kind: "logo" }>;
  wrap: CSSProperties;
  presence: number;
  enter: number;
  frame: number;
  center: number;
  accent: string;
}> = ({ scene, wrap, presence, enter, frame, center, accent }) => {
  const bloom = interpolate(enter, [0, 1], [0.2, 1.15]);
  const spacing = interpolate(enter, [0, 1], [0.42, 0.14]);
  const nameReveal = interpolate(frame, [center - 4, center + 26], [0, 1], {
    easing: EASE_OUT,
    ...clamp,
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          ...wrap,
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Eclipse size={660} bloom={bloom} accent={accent} />
        </div>
        <div
          style={{
            position: "relative",
            fontFamily: `${syne}, sans-serif`,
            fontWeight: 800,
            fontSize: 226,
            letterSpacing: `${spacing}em`,
            color: "#ffffff",
            textShadow: `0 0 70px ${withAlpha(accent, 0.55)}`,
          }}
        >
          {scene.mark}
        </div>
      </div>

      {/* Agency name pinned to the bottom of the frame */}
      <div
        style={{
          position: "absolute",
          bottom: 104,
          left: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: presence * nameReveal,
        }}
      >
        <div
          style={{
            height: 1,
            width: interpolate(nameReveal, [0, 1], [0, 380]),
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
        <div
          style={{
            fontFamily: `${inter}, sans-serif`,
            fontWeight: 500,
            fontSize: 23,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: withAlpha("#d7e6ff", 0.92),
          }}
        >
          {scene.name}
        </div>
        <div
          style={{
            fontFamily: `${inter}, sans-serif`,
            fontWeight: 400,
            fontSize: 17,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: withAlpha(accent, 0.9),
          }}
        >
          {scene.sub}
        </div>
      </div>
    </div>
  );
};
