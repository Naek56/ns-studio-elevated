import { type FC } from "react";
import { Composition } from "remotion";
import { WayMotion } from "./WayMotion";
import { WayPromo } from "./WayPromo";
import { DURATION, FPS, VH, VW } from "./wayMotion.data";
import { type WayMotionProps, type WayPromoProps } from "./types";

const wayMotionDefaults: WayMotionProps = {
  accent: "#3B82F6",
};

const wayPromoDefaults: WayPromoProps = {
  kicker: "Studio créatif",
  title: "WAY",
  tagline: "Votre concurrent sait ce qui se passe sur son site. Et vous ?",
  intelligence: "Kairos — une intelligence qui observe et anticipe votre marché.",
  closing: "Bien plus qu'une agence.",
  accent: "#ffffff",
};

export const RemotionRoot: FC = () => {
  return (
    <>
      <Composition
        id="WayMotion"
        component={WayMotion}
        durationInFrames={DURATION}
        fps={FPS}
        width={VW}
        height={VH}
        defaultProps={wayMotionDefaults}
      />
      <Composition
        id="WayPromo"
        component={WayPromo}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={wayPromoDefaults}
      />
    </>
  );
};
