/* Bouton rouge « gribouillis » : blob dessiné à la main, rempli de hachures
   griffonnées, animé façon dessin animé (« boiling » : les traits alternent
   entre deux versions pour vibrer comme un dessin image par image).
   `variant="alt"` = la version nettement différente qui réapparaît à la fin :
   orange vif, forme pilule plus haute et plus ronde, hachures VERTICALES. */

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
  const main = alt ? "#ff7a30" : "#e02d1b";
  const dark = alt ? "#d1490a" : "#a81505";
  const light = alt ? "#ffb37a" : "#ff6a4d";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="scribble-btn group relative outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {!alt ? (
        <svg viewBox="0 0 240 110" className="h-[84px] w-auto drop-shadow-[0_10px_30px_rgba(224,45,27,0.35)] transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-95 sm:h-[100px]" fill="none">
          <path d="M24 50 C 30 20, 70 10, 120 12 C 172 14, 220 22, 218 52 C 216 86, 176 100, 118 98 C 64 96, 18 82, 24 50 Z" fill={main} />
          <g className="sb-a" stroke={dark} strokeWidth="3" strokeLinecap="round" opacity="0.55">
            <path d="M36 66 L74 24 M56 78 L102 22 M80 84 L128 20 M106 88 L152 22 M132 88 L176 26 M158 86 L198 34 M182 82 L212 48" />
          </g>
          <g className="sb-b" stroke={dark} strokeWidth="3" strokeLinecap="round" opacity="0.55">
            <path d="M40 70 L80 26 M62 80 L108 24 M86 86 L134 22 M112 88 L158 24 M138 88 L182 28 M162 84 L202 38 M186 80 L214 52" />
          </g>
          <path className="sb-a" d="M24 50 C 30 20, 70 10, 120 12 C 172 14, 220 22, 218 52 C 216 86, 176 100, 118 98 C 64 96, 18 82, 24 50 Z" stroke={dark} strokeWidth="5" strokeLinejoin="round" />
          <path className="sb-b" d="M26 52 C 32 23, 72 13, 120 15 C 170 17, 217 24, 215 52 C 213 83, 174 97, 118 95 C 66 93, 21 80, 26 52 Z" stroke={dark} strokeWidth="4" strokeLinejoin="round" />
          <path className="sb-a" d="M44 34 C 60 24, 84 20, 104 21" stroke={light} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <path className="sb-b" d="M48 32 C 66 23, 88 19, 106 20" stroke={light} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        </svg>
      ) : (
        <svg viewBox="0 0 240 140" className="h-[104px] w-auto drop-shadow-[0_10px_30px_rgba(255,122,48,0.4)] transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-95 sm:h-[124px]" fill="none">
          {/* pilule haute, très arrondie — silhouette clairement différente */}
          <path d="M30 70 C 26 34, 62 16, 120 16 C 178 16, 214 34, 212 70 C 210 108, 176 126, 118 126 C 62 126, 34 106, 30 70 Z" fill={main} />
          {/* hachures VERTICALES ondulées */}
          <g className="sb-a" stroke={dark} strokeWidth="3.2" strokeLinecap="round" opacity="0.5">
            <path d="M56 34 C 52 56, 56 88, 60 106 M84 26 C 80 54, 84 92, 88 116 M112 22 C 108 54, 112 96, 116 120 M140 22 C 136 54, 140 96, 144 118 M168 28 C 164 54, 168 90, 172 110 M192 40 C 190 60, 192 84, 196 98" />
          </g>
          <g className="sb-b" stroke={dark} strokeWidth="3.2" strokeLinecap="round" opacity="0.5">
            <path d="M60 36 C 56 58, 60 90, 64 108 M88 28 C 84 56, 88 94, 92 116 M116 24 C 112 56, 116 98, 120 120 M144 24 C 140 56, 144 96, 148 116 M172 30 C 168 56, 172 90, 176 108 M196 44 C 194 62, 196 84, 199 96" />
          </g>
          <path className="sb-a" d="M30 70 C 26 34, 62 16, 120 16 C 178 16, 214 34, 212 70 C 210 108, 176 126, 118 126 C 62 126, 34 106, 30 70 Z" stroke={dark} strokeWidth="5" strokeLinejoin="round" />
          <path className="sb-b" d="M33 72 C 29 38, 64 20, 120 20 C 175 20, 209 37, 208 70 C 206 104, 174 122, 118 122 C 64 122, 37 104, 33 72 Z" stroke={dark} strokeWidth="4" strokeLinejoin="round" />
          <path className="sb-a" d="M52 40 C 72 28, 100 24, 122 25" stroke={light} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
          <path className="sb-b" d="M56 38 C 78 27, 104 23, 124 24" stroke={light} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
        </svg>
      )}
    </button>
  );
}
