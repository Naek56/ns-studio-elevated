import PaintedCloud from "./PaintedCloud";

/* Petits nuages « mixed media » disséminés dans les vides d'une section, qui
   dérivent doucement (un peu animés). À poser dans un parent `relative` ;
   restent en fond (pointer-events-none, derrière le contenu). */

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
  drift?: number; // amplitude du flottement horizontal (px)
};

export default function CloudDecor({ items }: { items: CloudDeco[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          className="cd-float absolute"
          style={{
            top: it.top,
            bottom: it.bottom,
            left: it.left,
            right: it.right,
            opacity: it.opacity ?? 0.5,
            ["--drift" as string]: `${it.drift ?? 14}px`,
            animationDelay: `${it.delay ?? 0}s`,
          }}
        >
          <PaintedCloud size={it.size ?? 130} base={it.base ?? "#4d86cf"} seed={it.seed ?? 12} />
        </span>
      ))}
    </div>
  );
}
