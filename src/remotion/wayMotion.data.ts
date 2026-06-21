// Timing model and narrative for the WayMotion piece.
// The camera descends through a vertical stack of full-screen scenes: it holds
// on each scene for HOLD frames, then eases down to the next over MOVE frames.

export const FPS = 30;
export const VW = 1920;
export const VH = 1080;

export const HOLD = 46; // frames a scene stays centered
export const MOVE = 30; // frames for the camera to glide to the next scene
export const L = HOLD + MOVE; // length of one scene segment

export type Scene =
  | { kind: "logo"; variant: "intro" | "outro"; mark: string; name: string; sub: string }
  | { kind: "line"; text: string; emphasis?: boolean; size: number };

export const SCENES: Scene[] = [
  { kind: "logo", variant: "intro", mark: "WAY", name: "WAY AGENCY", sub: "Studio créatif" },
  { kind: "line", text: "Votre concurrent sait ce qui se passe sur son site.", size: 74 },
  { kind: "line", text: "Et vous ?", emphasis: true, size: 184 },
  { kind: "line", text: "Bien plus qu'une agence.", emphasis: true, size: 116 },
  {
    kind: "line",
    text: "Kairos — une intelligence qui observe et anticipe votre marché.",
    size: 62,
  },
  { kind: "logo", variant: "outro", mark: "WAY", name: "WAY AGENCY", sub: "Bien plus qu'une agence." },
];

export const N = SCENES.length;
export const TAIL = 34; // frames held on the final scene before the master fade
export const DURATION = (N - 1) * L + HOLD + TAIL;
