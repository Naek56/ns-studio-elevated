/**
 * Editable props for the Remotion compositions.
 *
 * Kept as plain TypeScript types (rather than zod schemas) so the Remotion
 * tooling stays independent of the site's zod v3 dependency — Remotion 4 expects
 * zod v4, and the website's forms are pinned to v3.
 */
export type WayPromoProps = {
  kicker: string;
  title: string;
  tagline: string;
  intelligence: string;
  closing: string;
  accent: string;
};

export type WayMotionProps = {
  /** Blue accent driving the gradients, eclipse rim and emphasis text. */
  accent: string;
};
