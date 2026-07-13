/* Bouton rouge « gribouillis » : blob dessiné à la main, rempli de hachures
   griffonnées, animé façon dessin animé (« boiling » : les traits alternent
   entre deux versions pour vibrer comme un dessin image par image).
   `variant="alt"` = la version « légèrement différente » de la fin. */

export default function ScribbleButton({
  onClick,
  variant = "base",
  label = "appuie",
}: {
  onClick?: () => void;
  variant?: "base" | "alt";
  label?: string;
}) {
  const alt = variant === "alt";
  const main = alt ? "#ff5a36" : "#e02d1b"; // l'alt tire vers l'orangé
  const dark = alt ? "#c93a17" : "#a81505";
  const light = alt ? "#ff8a5c" : "#ff6a4d";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="scribble-btn group relative outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <svg
        viewBox="0 0 240 110"
        className="h-[84px] w-auto drop-shadow-[0_10px_30px_rgba(224,45,27,0.35)] transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-95 sm:h-[100px]"
        fill="none"
      >
        {/* fond du blob, tracé irrégulier */}
        <path
          d={alt
            ? "M28 52 C 22 24, 68 12, 122 14 C 178 16, 224 26, 220 56 C 216 88, 172 100, 116 98 C 62 96, 34 82, 28 52 Z"
            : "M24 50 C 30 20, 70 10, 120 12 C 172 14, 220 22, 218 52 C 216 86, 176 100, 118 98 C 64 96, 18 82, 24 50 Z"}
          fill={main}
        />
        {/* hachures griffonnées — version A */}
        <g className="sb-a" stroke={dark} strokeWidth="3" strokeLinecap="round" opacity="0.55">
          <path d="M36 66 L74 24 M56 78 L102 22 M80 84 L128 20 M106 88 L152 22 M132 88 L176 26 M158 86 L198 34 M182 82 L212 48" />
        </g>
        {/* hachures griffonnées — version B (léger décalage → boiling) */}
        <g className="sb-b" stroke={dark} strokeWidth="3" strokeLinecap="round" opacity="0.55">
          <path d="M40 70 L80 26 M62 80 L108 24 M86 86 L134 22 M112 88 L158 24 M138 88 L182 28 M162 84 L202 38 M186 80 L214 52" />
        </g>
        {/* contour repassé deux fois, comme au feutre */}
        <path
          className="sb-a"
          d={alt
            ? "M28 52 C 22 24, 68 12, 122 14 C 178 16, 224 26, 220 56 C 216 88, 172 100, 116 98 C 62 96, 34 82, 28 52 Z"
            : "M24 50 C 30 20, 70 10, 120 12 C 172 14, 220 22, 218 52 C 216 86, 176 100, 118 98 C 64 96, 18 82, 24 50 Z"}
          stroke={dark} strokeWidth="5" strokeLinejoin="round"
        />
        <path
          className="sb-b"
          d={alt
            ? "M30 54 C 25 27, 70 15, 122 17 C 176 19, 221 28, 217 56 C 213 85, 171 97, 117 95 C 65 93, 36 81, 30 54 Z"
            : "M26 52 C 32 23, 72 13, 120 15 C 170 17, 217 24, 215 52 C 213 83, 174 97, 118 95 C 66 93, 21 80, 26 52 Z"}
          stroke={dark} strokeWidth="4" strokeLinejoin="round"
        />
        {/* éclat de lumière griffonné */}
        <path className="sb-a" d="M44 34 C 60 24, 84 20, 104 21" stroke={light} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path className="sb-b" d="M48 32 C 66 23, 88 19, 106 20" stroke={light} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      </svg>
    </button>
  );
}
