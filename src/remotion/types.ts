/**
 * Editable props for the WAY promo composition.
 *
 * Kept as a plain TypeScript type (rather than a zod schema) so the Remotion
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
