/* Bouton « gribouillis » façon dessin au feutre, animé image par image
   (« boiling » : deux jeux de traits qui alternent). Les hachures sont
   CLIPPÉES dans la forme (plus de traits qui dépassent), remplissage
   deux tons, ombre dessinée au sol, reflet feutre.
   `variant="alt"` = la version nettement différente de la fin. */

const BASE_BLOB = "M24 50 C 30 20, 70 10, 120 12 C 172 14, 220 22, 218 52 C 216 86, 176 100, 118 98 C 64 96, 18 82, 24 50 Z";
const BASE_BLOB_2 = "M26 52 C 32 23, 72 13, 120 15 C 170 17, 217 24, 215 52 C 213 83, 174 97, 118 95 C 66 93, 21 80, 26 52 Z";
const ALT_BLOB = "M30 70 C 26 34, 62 16, 120 16 C 178 16, 214 34, 212 70 C 210 108, 176 126, 118 126 C 62 126, 34 106, 30 70 Z";
const ALT_BLOB_2 = "M33 72 C 29 38, 64 20, 120 20 C 175 20, 209 37, 208 70 C 206 104, 174 122, 118 122 C 64 122, 37 104, 33 72 Z";

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

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="scribble-btn group relative outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {!alt ? (
        <svg viewBox="0 0 240 130" className="h-[96px] w-auto transition-transform duration-300 group-hover:scale-[1.05] group-active:scale-95 sm:h-[112px]" fill="none">
          <defs>
            <linearGradient id="sbg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f04430" />
              <stop offset="0.55" stopColor="#e02d1b" />
              <stop offset="1" stopColor="#b81d0c" />
            </linearGradient>
            <clipPath id="sbclip"><path d={BASE_BLOB} /></clipPath>
          </defs>

          {/* ombre au sol, dessinée */}
          <g className="sb-a"><ellipse cx="122" cy="116" rx="76" ry="9" fill="#000" opacity="0.4" /></g>
          <g className="sb-b"><ellipse cx="118" cy="116" rx="80" ry="8" fill="#000" opacity="0.4" /></g>

          {/* corps deux tons */}
          <path d={BASE_BLOB} fill="url(#sbg)" />

          {/* hachures croisées, clippées dans la forme */}
          <g clipPath="url(#sbclip)">
            <g className="sb-a" stroke="#8f1204" strokeWidth="3" strokeLinecap="round" opacity="0.4">
              <path d="M20 78 L70 8 M44 88 L100 6 M70 94 L128 6 M96 98 L154 8 M122 98 L180 10 M148 96 L204 16 M174 92 L222 28 M198 88 L232 44" />
            </g>
            <g className="sb-b" stroke="#8f1204" strokeWidth="3" strokeLinecap="round" opacity="0.4">
              <path d="M26 82 L76 10 M50 90 L106 6 M76 96 L134 6 M102 98 L160 8 M128 98 L186 12 M154 96 L210 20 M180 90 L226 32 M202 86 L234 50" />
            </g>
            {/* contre-hachures légères (croisement) */}
            <g className="sb-a" stroke="#ffb3a6" strokeWidth="2" strokeLinecap="round" opacity="0.18">
              <path d="M30 20 L90 92 M70 14 L136 94 M112 12 L178 90 M154 14 L214 82" />
            </g>
            <g className="sb-b" stroke="#ffb3a6" strokeWidth="2" strokeLinecap="round" opacity="0.18">
              <path d="M38 18 L98 92 M80 12 L146 94 M122 12 L188 88 M164 16 L220 78" />
            </g>
            {/* assombrissement du bas (volume) */}
            <path d="M20 74 C 60 96, 180 96, 224 66 L 224 110 L 20 110 Z" fill="#7d0e02" opacity="0.35" />
          </g>

          {/* contour repassé deux fois */}
          <path className="sb-a" d={BASE_BLOB} stroke="#7d1103" strokeWidth="5.5" strokeLinejoin="round" />
          <path className="sb-b" d={BASE_BLOB_2} stroke="#7d1103" strokeWidth="4.5" strokeLinejoin="round" />

          {/* reflet feutre + étincelle */}
          <path className="sb-a" d="M42 34 C 60 22, 92 18, 116 19" stroke="#ffd9d1" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
          <path className="sb-b" d="M46 32 C 66 21, 96 17, 118 18" stroke="#ffd9d1" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
          <g className="sb-a" stroke="#ffe9e5" strokeWidth="2.5" strokeLinecap="round"><path d="M206 18 v8 M202 22 h8" /></g>
          <g className="sb-b" stroke="#ffe9e5" strokeWidth="2.5" strokeLinecap="round"><path d="M208 20 v8 M204 24 h8" /></g>
        </svg>
      ) : (
        <svg viewBox="0 0 240 158" className="h-[112px] w-auto transition-transform duration-300 group-hover:scale-[1.05] group-active:scale-95 sm:h-[132px]" fill="none">
          <defs>
            <linearGradient id="sbga" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff9a4d" />
              <stop offset="0.55" stopColor="#ff7a30" />
              <stop offset="1" stopColor="#e05a10" />
            </linearGradient>
            <clipPath id="sbclipa"><path d={ALT_BLOB} /></clipPath>
          </defs>

          <g className="sb-a"><ellipse cx="122" cy="144" rx="72" ry="9" fill="#000" opacity="0.4" /></g>
          <g className="sb-b"><ellipse cx="118" cy="144" rx="76" ry="8" fill="#000" opacity="0.4" /></g>

          <path d={ALT_BLOB} fill="url(#sbga)" />

          <g clipPath="url(#sbclipa)">
            {/* hachures VERTICALES ondulées */}
            <g className="sb-a" stroke="#b04206" strokeWidth="3.2" strokeLinecap="round" opacity="0.45">
              <path d="M56 24 C 52 56, 56 96, 60 122 M84 18 C 80 56, 84 100, 88 128 M112 14 C 108 56, 112 104, 116 132 M140 14 C 136 56, 140 104, 144 130 M168 18 C 164 56, 168 98, 172 124 M194 28 C 192 58, 194 92, 198 112" />
            </g>
            <g className="sb-b" stroke="#b04206" strokeWidth="3.2" strokeLinecap="round" opacity="0.45">
              <path d="M60 26 C 56 58, 60 98, 64 124 M88 20 C 84 58, 88 102, 92 128 M116 16 C 112 58, 116 106, 120 132 M144 16 C 140 58, 144 104, 148 128 M172 20 C 168 58, 172 96, 176 120 M198 32 C 196 60, 198 90, 201 108" />
            </g>
            <g className="sb-a" stroke="#ffd2ae" strokeWidth="2" strokeLinecap="round" opacity="0.2">
              <path d="M40 52 C 90 40, 160 40, 206 54 M38 84 C 90 72, 162 72, 208 84" />
            </g>
            <g className="sb-b" stroke="#ffd2ae" strokeWidth="2" strokeLinecap="round" opacity="0.2">
              <path d="M40 56 C 92 44, 160 44, 206 58 M38 88 C 92 76, 160 76, 208 88" />
            </g>
            <path d="M28 96 C 70 124, 176 124, 216 92 L 216 140 L 28 140 Z" fill="#a63c04" opacity="0.35" />
          </g>

          <path className="sb-a" d={ALT_BLOB} stroke="#a03a03" strokeWidth="5.5" strokeLinejoin="round" />
          <path className="sb-b" d={ALT_BLOB_2} stroke="#a03a03" strokeWidth="4.5" strokeLinejoin="round" />

          <path className="sb-a" d="M50 42 C 72 28, 102 24, 126 25" stroke="#ffe3c9" strokeWidth="6.5" strokeLinecap="round" opacity="0.9" />
          <path className="sb-b" d="M54 40 C 78 27, 106 23, 128 24" stroke="#ffe3c9" strokeWidth="6.5" strokeLinecap="round" opacity="0.9" />
          <g className="sb-a" stroke="#fff1e2" strokeWidth="2.5" strokeLinecap="round"><path d="M198 24 v9 M193.5 28.5 h9" /></g>
          <g className="sb-b" stroke="#fff1e2" strokeWidth="2.5" strokeLinecap="round"><path d="M200 26 v9 M195.5 30.5 h9" /></g>
        </svg>
      )}
    </button>
  );
}
