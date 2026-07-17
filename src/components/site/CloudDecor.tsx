import CloudSprite from "./CloudSprite";

/* Nuages « mixed media » disséminés dans les vides d'une section. FIXES
   (aucune animation). À poser dans un parent `relative` ; restent en fond. */

export type CloudDeco = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size?: number;
  base?: string;
  seed?: number;
  opacity?: number;
  flip?: boolean;
};

export default function CloudDecor({ items }: { items: CloudDeco[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: it.top,
            bottom: it.bottom,
            left: it.left,
            right: it.right,
            opacity: it.opacity ?? 0.55,
          }}
        >
          <CloudSprite size={it.size ?? 130} flip={it.flip} base={it.base ?? "#4d86cf"} seed={it.seed ?? 12} />
        </span>
      ))}
    </div>
  );
}
