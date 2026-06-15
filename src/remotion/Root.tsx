import { type FC } from "react";
import { Composition } from "remotion";
import { WayPromo } from "./WayPromo";
import { type WayPromoProps } from "./types";

const defaultProps: WayPromoProps = {
  kicker: "Studio créatif",
  title: "WAY",
  tagline: "Votre concurrent sait ce qui se passe sur son site. Et vous ?",
  intelligence: "Kairos — une intelligence qui observe et anticipe votre marché.",
  closing: "Bien plus qu'une agence.",
  accent: "#ffffff",
};

export const RemotionRoot: FC = () => {
  return (
    <Composition
      id="WayPromo"
      component={WayPromo}
      durationInFrames={270}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
  );
};
