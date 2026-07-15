/* Petites icônes « pixel art » années 90 (façon vieilles icônes d'OS).
   Dessinées pixel par pixel en SVG (shape-rendering: crispEdges) — aucune
   image externe. Utilisées un peu partout à côté des textes pour donner
   de la vie. */

type Bitmap = { w: number; h: number; pal: Record<string, string>; rows: string[] };

const ICONS: Record<string, Bitmap> = {
  heart: { w: 7, h: 6, pal: { X: "#ff415f", K: "#7a0b1f" }, rows: [
    ".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."] },
  star: { w: 9, h: 9, pal: { X: "#ffd23f", K: "#a9781a" }, rows: [
    "....X....", "....X....", "...XXX...", "XXXXXXXXX", ".XXXXXXX.",
    "..XXXXX..", "..XXXXX..", ".XX...XX.", ".X.....X."] },
  diamond: { w: 7, h: 7, pal: { X: "#3fd0ff", K: "#12688f" }, rows: [
    "...X...", "..XXX..", ".XXXXX.", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."] },
  plus: { w: 7, h: 7, pal: { X: "#ff4d4d", K: "#8a1f1f" }, rows: [
    "..XXX..", "..XXX..", "XXXXXXX", "XXXXXXX", "XXXXXXX", "..XXX..", "..XXX.."] },
  cursor: { w: 8, h: 11, pal: { X: "#ffffff", K: "#111111" }, rows: [
    "K.......", "KK......", "KXK.....", "KXXK....", "KXXXK...", "KXXXXK..",
    "KXXXXXK.", "KXXKKKKK", "KXK.KX..", "KK..KX..", "....KK.."] },
  smiley: { w: 9, h: 9, pal: { X: "#ffe14d", K: "#0f0f0f" }, rows: [
    ".KKKKKKK.", "KXXXXXXXK", "KXKXXKXXK", "KXKXXKXXK", "KXXXXXXXK",
    "KXKXXXKXK", "KXXKKKXXK", "KXXXXXXXK", ".KKKKKKK."] },
  floppy: { w: 9, h: 9, pal: { X: "#3b6ea5", K: "#12314e", W: "#e9eef5" }, rows: [
    "KKKKKKKKK", "KXXKWWKXK", "KXXKWWKXK", "KXXKWWKXK", "KXXXXXXXK",
    "KWWWWWWWK", "KWKKKKKWK", "KWWWWWWWK", "KKKKKKKKK"] },
  globe: { w: 9, h: 9, pal: { X: "#4fb0e6", K: "#123f5e" }, rows: [
    ".KKKKKKK.", "KXXKXXKXK", "KKXXKXXKK", "KXXXKXXXK", "KKKKKKKKK",
    "KXXXKXXXK", "KKXXKXXKK", "KXXKXXKXK", ".KKKKKKK."] },
  bulb: { w: 7, h: 9, pal: { X: "#ffe14d", K: "#7a5a12", W: "#bcbcbc" }, rows: [
    "..KKK..", ".KXXXK.", "KXXXXXK", "KXXXXXK", "KXXXXXK", ".KXXXK.",
    ".KWWWK.", ".KWWWK.", "..KWK.."] },
  sparkle: { w: 9, h: 9, pal: { X: "#ffffff", K: "#8ec9ff" }, rows: [
    "....X....", "....X....", "...XXX...", "..X.X.X..", "XXX.X.XXX",
    "..X.X.X..", "...XXX...", "....X....", "....X...."] },
};

export type PixelIconName = keyof typeof ICONS;

export default function PixelIcon({
  name,
  size = 22,
  className = "",
  style,
}: {
  name: PixelIconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ic = ICONS[name];
  if (!ic) return null;
  const rects: React.ReactNode[] = [];
  ic.rows.forEach((row, y) => {
    for (let x = 0; x < ic.w; x++) {
      const c = row[x];
      if (c && c !== ".") {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={ic.pal[c] || "#f0f"} />);
      }
    }
  });
  return (
    <svg
      aria-hidden
      width={size}
      height={(size * ic.h) / ic.w}
      viewBox={`0 0 ${ic.w} ${ic.h}`}
      shapeRendering="crispEdges"
      className={`inline-block select-none ${className}`}
      style={{ imageRendering: "pixelated", ...style }}
    >
      {rects}
    </svg>
  );
}
