import PixelIcon, { type PixelIconName } from "./PixelIcon";

/* Petites décorations pixel disséminées dans les grands vides d'une section
   (coins, marges). Discrètes, elles flottent doucement pour donner de la vie
   sans charger — on casse le côté trop épuré. À poser dans un parent
   `relative` ; ça reste en fond (pointer-events-none, derrière le contenu). */

export type Deco = {
  name: PixelIconName;
  /* position en % : au moins un de left/right et top/bottom */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size?: number;
  rotate?: number;
  opacity?: number;
  delay?: number;
};

export default function PixelScatter({ items }: { items: Deco[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          className="px-float absolute"
          style={{
            top: it.top,
            bottom: it.bottom,
            left: it.left,
            right: it.right,
            // variables lues par l'animation .px-float
            ["--rot" as string]: `${it.rotate ?? 0}deg`,
            ["--op" as string]: it.opacity ?? 0.32,
            animationDelay: `${it.delay ?? 0}s`,
            transform: `rotate(${it.rotate ?? 0}deg)`,
          }}
        >
          <PixelIcon name={it.name} size={it.size ?? 20} />
        </span>
      ))}
    </div>
  );
}
