import CloudSprite from "./CloudSprite";

/* Nuages « mixed media » disséminés dans les vides d'une section. Ils bougent
   nettement : dérive horizontale (droite ↔ gauche) + léger pivot, comme une
   animation mixed-media (stop-motion). À poser dans un parent `relative`. */

export type CloudDeco = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size?: number;
  base?: string;
  seed?: number;
  opacity?: number;
  delay?: number;
  flip?: boolean;
  travel?: number; // amplitude de dérive horizontale (px)
  pivot?: number;  // amplitude de rotation (deg)
  dur?: number;    // durée du cycle (s)
};

export default function CloudDecor({ items }: { items: CloudDeco[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {items.map((it, i) => {
        const t = it.travel ?? 46;
        const r = it.pivot ?? 5;
        return (
          <span
            key={i}
            className="cd-float absolute"
            style={{
              top: it.top,
              bottom: it.bottom,
              left: it.left,
              right: it.right,
              opacity: it.opacity ?? 0.55,
              ["--xa" as string]: `${t}px`,
              ["--xb" as string]: `${-t}px`,
              ["--ra" as string]: `${-r}deg`,
              ["--rb" as string]: `${r}deg`,
              ["--dur" as string]: `${it.dur ?? 16}s`,
              animationDelay: `${it.delay ?? 0}s`,
            }}
          >
            <CloudSprite size={it.size ?? 130} flip={it.flip} base={it.base ?? "#4d86cf"} seed={it.seed ?? 12} />
          </span>
        );
      })}
    </div>
  );
}
