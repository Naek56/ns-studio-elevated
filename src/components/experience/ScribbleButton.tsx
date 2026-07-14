/* Bouton « dessiné au crayon rouge » : des cercles de traits granuleux qui
   se superposent (comme un crayon repassé plusieurs fois), un léger
   remplissage hachuré, et c'est tout. L'effet « boiling » (deux jeux de
   traits qui alternent) le fait vibrer comme un dessin.
   `variant="alt"` = version différente : crayon ORANGE, ovale, hachures
   horizontales. */

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
        <svg viewBox="0 0 200 200" className="h-[140px] w-auto transition-transform duration-300 group-hover:scale-[1.06] group-active:scale-95 sm:h-[160px]" fill="none">
          <defs>
            {/* grain crayon : léger déplacement granuleux des traits */}
            <filter id="pcl-a" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
            </filter>
            <filter id="pcl-b" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="11" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
            </filter>
            <clipPath id="pcl-clip"><circle cx="100" cy="100" r="64" /></clipPath>
          </defs>

          {/* ombre discrète */}
          <ellipse cx="100" cy="182" rx="46" ry="5" fill="#000" opacity="0.22" />

          {/* remplissage : hachures crayon diagonales, légères */}
          <g clipPath="url(#pcl-clip)">
            <g className="sb-a" filter="url(#pcl-a)" stroke="#ff4530" strokeWidth="2.4" strokeLinecap="round" opacity="0.45">
              <path d="M40 130 L120 40 M48 148 L142 44 M62 158 L156 52 M80 164 L166 66 M100 166 L172 84 M124 162 L174 106" />
            </g>
            <g className="sb-b" filter="url(#pcl-b)" stroke="#ff4530" strokeWidth="2.4" strokeLinecap="round" opacity="0.45">
              <path d="M44 134 L124 42 M52 150 L146 46 M66 160 L160 56 M86 166 L168 70 M106 166 L174 90 M130 160 L175 112" />
            </g>
            {/* masse centrale très légère */}
            <circle cx="100" cy="100" r="60" fill="#ff4530" opacity="0.2" />
          </g>

          {/* cercles crayon repassés (boiling) */}
          <g className="sb-a" filter="url(#pcl-a)" stroke="#ff4530" fill="none" strokeLinecap="round">
            <path d="M100 34 C 140 34, 167 62, 166 100 C 165 140, 138 166, 99 166 C 60 166, 34 138, 35 99 C 36 62, 62 34, 100 34 Z" strokeWidth="3.4" opacity="0.9" />
            <path d="M101 42 C 135 42, 158 66, 158 100 C 158 134, 134 158, 100 158 C 66 158, 43 134, 43 100 C 43 68, 67 42, 101 42 Z" strokeWidth="2.4" opacity="0.6" />
            <path d="M98 28 C 143 26, 173 58, 172 100 C 171 145, 140 172, 98 172 C 56 172, 28 142, 29 98 C 30 56, 58 30, 98 28 Z" strokeWidth="1.8" opacity="0.4" />
          </g>
          <g className="sb-b" filter="url(#pcl-b)" stroke="#ff4530" fill="none" strokeLinecap="round">
            <path d="M99 35 C 139 33, 166 60, 166 99 C 166 139, 139 167, 100 167 C 61 167, 34 140, 34 100 C 34 61, 61 37, 99 35 Z" strokeWidth="3.4" opacity="0.9" />
            <path d="M100 43 C 134 41, 157 64, 157 99 C 157 133, 135 157, 101 157 C 67 157, 44 135, 44 101 C 44 67, 66 45, 100 43 Z" strokeWidth="2.4" opacity="0.6" />
            <path d="M100 29 C 142 27, 171 56, 171 99 C 171 143, 142 171, 100 171 C 58 171, 29 143, 29 99 C 29 57, 58 31, 100 29 Z" strokeWidth="1.8" opacity="0.4" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 230 170" className="h-[130px] w-auto transition-transform duration-300 group-hover:scale-[1.06] group-active:scale-95 sm:h-[148px]" fill="none">
          <defs>
            <filter id="pcla-a" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="17" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
            </filter>
            <filter id="pcla-b" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="23" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
            </filter>
            <clipPath id="pcla-clip"><ellipse cx="115" cy="82" rx="86" ry="58" /></clipPath>
          </defs>

          <ellipse cx="115" cy="156" rx="58" ry="5" fill="#000" opacity="0.22" />

          {/* remplissage : hachures HORIZONTALES légères */}
          <g clipPath="url(#pcla-clip)">
            <g className="sb-a" filter="url(#pcla-a)" stroke="#ff8a3c" strokeWidth="2.4" strokeLinecap="round" opacity="0.45">
              <path d="M32 52 H198 M28 70 H202 M26 88 H204 M30 106 H200 M40 124 H190" />
            </g>
            <g className="sb-b" filter="url(#pcla-b)" stroke="#ff8a3c" strokeWidth="2.4" strokeLinecap="round" opacity="0.45">
              <path d="M34 56 H196 M30 74 H202 M28 92 H203 M33 110 H198 M44 127 H186" />
            </g>
            <ellipse cx="115" cy="82" rx="80" ry="52" fill="#ff8a3c" opacity="0.2" />
          </g>

          {/* OVALES crayon orange repassés */}
          <g className="sb-a" filter="url(#pcla-a)" stroke="#ff8a3c" fill="none" strokeLinecap="round">
            <path d="M115 24 C 168 24, 202 50, 201 82 C 200 116, 166 140, 114 140 C 62 140, 29 114, 30 81 C 31 49, 63 24, 115 24 Z" strokeWidth="3.4" opacity="0.9" />
            <path d="M115 32 C 160 32, 192 54, 191 82 C 190 112, 160 132, 114 132 C 68 132, 39 110, 40 81 C 41 53, 70 32, 115 32 Z" strokeWidth="2.4" opacity="0.6" />
            <path d="M114 18 C 172 16, 208 46, 207 82 C 206 120, 170 146, 114 146 C 58 146, 23 118, 24 80 C 25 44, 60 20, 114 18 Z" strokeWidth="1.8" opacity="0.4" />
          </g>
          <g className="sb-b" filter="url(#pcla-b)" stroke="#ff8a3c" fill="none" strokeLinecap="round">
            <path d="M114 25 C 167 23, 201 49, 201 81 C 201 115, 167 141, 115 141 C 63 141, 30 115, 30 82 C 30 50, 62 27, 114 25 Z" strokeWidth="3.4" opacity="0.9" />
            <path d="M114 33 C 159 31, 191 53, 191 81 C 191 111, 161 133, 115 133 C 69 133, 40 111, 40 82 C 40 54, 69 35, 114 33 Z" strokeWidth="2.4" opacity="0.6" />
            <path d="M115 19 C 171 17, 207 45, 206 81 C 205 119, 171 147, 115 147 C 59 147, 24 119, 25 81 C 26 45, 59 21, 115 19 Z" strokeWidth="1.8" opacity="0.4" />
          </g>
        </svg>
      )}
    </button>
  );
}
