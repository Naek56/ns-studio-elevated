/* Bouton rond « aquarelle + fils gribouillés » (d'après les références) :
   une pastille aquarelle au bord irrégulier (turbulence SVG), des nappes
   de couleur qui se chevauchent, et par-dessus des fils circulaires
   griffonnés qui vibrent (« boiling »). Ombre au sol + reflet + anneau
   discret pour que ça reste clairement UN BOUTON.
   `variant="alt"` = version nettement différente (orange, ovale, fils
   horizontaux). */

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
        <svg viewBox="0 0 220 230" className="h-[150px] w-auto transition-transform duration-300 group-hover:scale-[1.05] group-active:scale-95 sm:h-[176px]" fill="none">
          <defs>
            <radialGradient id="wc-base" cx="0.42" cy="0.38">
              <stop offset="0" stopColor="#ef5a43" />
              <stop offset="0.55" stopColor="#d92c18" />
              <stop offset="1" stopColor="#a81505" />
            </radialGradient>
            <radialGradient id="wc-pool" cx="0.6" cy="0.7">
              <stop offset="0" stopColor="#8f1204" stopOpacity="0.75" />
              <stop offset="1" stopColor="#8f1204" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="wc-light" cx="0.3" cy="0.25">
              <stop offset="0" stopColor="#ff9d8a" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ff9d8a" stopOpacity="0" />
            </radialGradient>
            {/* bord aquarelle irrégulier */}
            <filter id="wc-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="3" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="14" />
            </filter>
            <filter id="wc-edge2" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="13" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="18" />
            </filter>
            {/* grain papier dans la couleur */}
            <filter id="wc-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" result="a" />
              <feComposite in="a" in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* ombre au sol */}
          <g className="sb-a"><ellipse cx="112" cy="212" rx="62" ry="8" fill="#000" opacity="0.4" /></g>
          <g className="sb-b"><ellipse cx="108" cy="212" rx="66" ry="7" fill="#000" opacity="0.4" /></g>

          {/* pastille aquarelle : nappes superposées aux bords irréguliers */}
          <circle cx="110" cy="104" r="86" fill="url(#wc-base)" filter="url(#wc-edge)" />
          <circle cx="118" cy="118" r="66" fill="url(#wc-pool)" filter="url(#wc-edge2)" />
          <circle cx="88" cy="80" r="46" fill="url(#wc-light)" filter="url(#wc-edge2)" opacity="0.8" />
          {/* grain aquarelle */}
          <circle cx="110" cy="104" r="84" filter="url(#wc-grain)" opacity="0.5" />

          {/* fils griffonnés circulaires (boiling) */}
          <g className="sb-a" stroke="#7d1103" strokeLinecap="round" fill="none">
            <path d="M110 30 C 156 30, 186 62, 184 104 C 182 148, 152 178, 108 178 C 64 178, 36 146, 38 102 C 40 60, 68 32, 110 30 Z" strokeWidth="2" opacity="0.5" />
            <path d="M112 42 C 148 44, 172 68, 171 104 C 170 140, 146 166, 110 165 C 74 164, 51 138, 52 102 C 53 68, 76 44, 112 42 Z" strokeWidth="1.6" opacity="0.4" />
            <path d="M108 56 C 138 54, 158 76, 158 104 C 158 132, 138 152, 110 152 C 82 152, 64 132, 64 104 C 64 78, 80 58, 108 56 Z" strokeWidth="1.4" opacity="0.35" />
          </g>
          <g className="sb-b" stroke="#7d1103" strokeLinecap="round" fill="none">
            <path d="M108 32 C 154 30, 184 60, 183 102 C 182 146, 154 176, 110 177 C 66 178, 37 148, 38 104 C 39 62, 66 34, 108 32 Z" strokeWidth="2" opacity="0.5" />
            <path d="M110 44 C 146 42, 170 66, 170 102 C 170 138, 148 164, 112 164 C 76 164, 52 140, 53 104 C 54 70, 74 46, 110 44 Z" strokeWidth="1.6" opacity="0.4" />
            <path d="M110 58 C 140 56, 159 78, 158 106 C 157 134, 136 153, 108 152 C 80 151, 63 130, 64 102 C 65 76, 82 60, 110 58 Z" strokeWidth="1.4" opacity="0.35" />
          </g>

          {/* reflet + étincelle */}
          <path className="sb-a" d="M70 62 C 82 48, 104 40, 124 42" stroke="#ffd9d1" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
          <path className="sb-b" d="M72 60 C 86 47, 106 39, 126 41" stroke="#ffd9d1" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
          <g className="sb-a" stroke="#ffe9e5" strokeWidth="2.2" strokeLinecap="round"><path d="M172 44 v9 M167.5 48.5 h9" /></g>
          <g className="sb-b" stroke="#ffe9e5" strokeWidth="2.2" strokeLinecap="round"><path d="M174 46 v9 M169.5 50.5 h9" /></g>
        </svg>
      ) : (
        <svg viewBox="0 0 240 210" className="h-[150px] w-auto transition-transform duration-300 group-hover:scale-[1.05] group-active:scale-95 sm:h-[172px]" fill="none">
          <defs>
            <radialGradient id="wca-base" cx="0.45" cy="0.4">
              <stop offset="0" stopColor="#ffa25e" />
              <stop offset="0.55" stopColor="#ff7a30" />
              <stop offset="1" stopColor="#d85608" />
            </radialGradient>
            <radialGradient id="wca-pool" cx="0.62" cy="0.68">
              <stop offset="0" stopColor="#a63c04" stopOpacity="0.7" />
              <stop offset="1" stopColor="#a63c04" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="wca-light" cx="0.32" cy="0.28">
              <stop offset="0" stopColor="#ffd2ae" stopOpacity="0.95" />
              <stop offset="1" stopColor="#ffd2ae" stopOpacity="0" />
            </radialGradient>
            <filter id="wca-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="21" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="16" />
            </filter>
            <filter id="wca-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" result="a" />
              <feComposite in="a" in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          <g className="sb-a"><ellipse cx="122" cy="194" rx="74" ry="8" fill="#000" opacity="0.4" /></g>
          <g className="sb-b"><ellipse cx="118" cy="194" rx="78" ry="7" fill="#000" opacity="0.4" /></g>

          {/* OVALE aquarelle (silhouette clairement différente) */}
          <ellipse cx="120" cy="98" rx="100" ry="76" fill="url(#wca-base)" filter="url(#wca-edge)" />
          <ellipse cx="132" cy="112" rx="72" ry="52" fill="url(#wca-pool)" filter="url(#wca-edge)" />
          <ellipse cx="92" cy="74" rx="50" ry="36" fill="url(#wca-light)" filter="url(#wca-edge)" opacity="0.85" />
          <ellipse cx="120" cy="98" rx="98" ry="74" filter="url(#wca-grain)" opacity="0.5" />

          {/* fils HORIZONTAUX ondulés (différent des cercles) */}
          <g className="sb-a" stroke="#a03a03" strokeLinecap="round" fill="none">
            <path d="M34 76 C 80 66, 160 66, 206 78" strokeWidth="2" opacity="0.5" />
            <path d="M28 98 C 80 88, 162 88, 212 100" strokeWidth="1.8" opacity="0.45" />
            <path d="M34 120 C 84 112, 158 112, 206 120" strokeWidth="1.6" opacity="0.4" />
            <path d="M48 140 C 92 134, 150 134, 192 140" strokeWidth="1.4" opacity="0.35" />
          </g>
          <g className="sb-b" stroke="#a03a03" strokeLinecap="round" fill="none">
            <path d="M32 80 C 82 70, 160 70, 208 82" strokeWidth="2" opacity="0.5" />
            <path d="M30 102 C 82 92, 160 92, 210 104" strokeWidth="1.8" opacity="0.45" />
            <path d="M36 124 C 86 116, 156 116, 204 124" strokeWidth="1.6" opacity="0.4" />
            <path d="M50 143 C 94 137, 148 137, 190 143" strokeWidth="1.4" opacity="0.35" />
          </g>

          <path className="sb-a" d="M62 56 C 80 42, 108 36, 132 38" stroke="#ffe3c9" strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
          <path className="sb-b" d="M66 54 C 84 41, 110 35, 134 37" stroke="#ffe3c9" strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
          <g className="sb-a" stroke="#fff1e2" strokeWidth="2.2" strokeLinecap="round"><path d="M196 40 v9 M191.5 44.5 h9" /></g>
          <g className="sb-b" stroke="#fff1e2" strokeWidth="2.2" strokeLinecap="round"><path d="M198 42 v9 M193.5 46.5 h9" /></g>
        </svg>
      )}
    </button>
  );
}
