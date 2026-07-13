/* Illustrations animées « façon Lottie » (SVG + CSS) qui résument chaque
   pilier. Dégradés, halos et détails pour un graphisme soigné. */

const box = "h-24 w-24 md:h-28 md:w-28";

/* ---------------------------------- AGENCE -------------------------------- */

// Stratégie — radar qui balaie, cible, blips lumineux
export function IconStrategy() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <defs>
        <linearGradient id="st-sweep" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#63b3dd" stopOpacity="0.55" />
          <stop offset="1" stopColor="#63b3dd" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="st-core">
          <stop offset="0" stopColor="#63b3dd" stopOpacity="0.5" />
          <stop offset="1" stopColor="#63b3dd" stopOpacity="0" />
        </radialGradient>
        <filter id="st-glow"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>
      <circle cx="50" cy="50" r="12" fill="url(#st-core)" />
      <circle cx="50" cy="50" r="37" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.3" />
      <circle cx="50" cy="50" r="25" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.3" />
      <circle cx="50" cy="50" r="13" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.3" />
      <path d="M50 12 V88 M12 50 H88" stroke="#fff" strokeOpacity="0.1" strokeWidth="1" />
      <g className="il-spin">
        <path d="M50 50 L50 13 A37 37 0 0 1 80 31 Z" fill="url(#st-sweep)" />
        <line x1="50" y1="50" x2="50" y2="13" stroke="#8ecbe8" strokeWidth="2.5" filter="url(#st-glow)" />
        <line x1="50" y1="50" x2="50" y2="13" stroke="#cdeaf7" strokeWidth="1.4" />
      </g>
      <circle className="il-twinkle" cx="66" cy="34" r="2.2" fill="#8ecbe8" />
      <circle className="il-twinkle" cx="36" cy="64" r="2" fill="#8ecbe8" style={{ animationDelay: "0.8s" }} />
      <circle className="il-pulse" cx="64" cy="60" r="3.4" fill="#4a90ff" filter="url(#st-glow)" />
      <circle cx="64" cy="60" r="2" fill="#bcd4ff" />
      <circle cx="50" cy="50" r="2.6" fill="#fff" />
    </svg>
  );
}

// Design — plan de travail, courbe qui se dessine, palette, stylo
export function IconDesign() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <defs>
        <linearGradient id="dz-curve" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#4a90ff" />
          <stop offset="1" stopColor="#8ecbe8" />
        </linearGradient>
        <filter id="dz-glow"><feGaussianBlur stdDeviation="1.4" /></filter>
      </defs>
      <rect x="18" y="12" width="64" height="62" rx="8" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.4" />
      <path d="M18 24 H82" stroke="#fff" strokeOpacity="0.14" strokeWidth="1" />
      <circle cx="24" cy="18" r="1.5" fill="#fff" fillOpacity="0.4" />
      <circle cx="30" cy="18" r="1.5" fill="#fff" fillOpacity="0.4" />
      <path className="il-draw" d="M26 62 C 40 24, 58 68, 74 30" stroke="url(#dz-curve)" strokeWidth="3.4" strokeLinecap="round" filter="url(#dz-glow)" style={{ ["--len" as string]: 130 }} />
      <path className="il-draw" d="M26 62 C 40 24, 58 68, 74 30" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.4" strokeLinecap="round" style={{ ["--len" as string]: 130 }} />
      <g className="il-float">
        <path d="M74 30 l8 -8 5 5 -8 8 z" fill="#fff" />
        <path d="M74 30 l5 5" stroke="#4a90ff" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="74" cy="30" r="1.6" fill="#4a90ff" />
      </g>
      <circle cx="30" cy="86" r="4" fill="#e0563f" className="il-twinkle" />
      <circle cx="43" cy="86" r="4" fill="#4a90ff" className="il-twinkle" style={{ animationDelay: "0.4s" }} />
      <circle cx="56" cy="86" r="4" fill="#f5b301" className="il-twinkle" style={{ animationDelay: "0.8s" }} />
      <circle cx="69" cy="86" r="4" fill="#2ec28b" className="il-twinkle" style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

// Performance — barres en dégradé qui montent + flèche de tendance lumineuse
export function IconPerformance() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <defs>
        <linearGradient id="pf-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3b6ba6" />
          <stop offset="1" stopColor="#63b3dd" />
        </linearGradient>
        <filter id="pf-glow"><feGaussianBlur stdDeviation="1.4" /></filter>
      </defs>
      <path d="M22 80 H84 M22 80 V22" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 46 H84 M22 63 H84" stroke="#fff" strokeOpacity="0.08" strokeWidth="1" />
      <rect className="il-bar" x="29" y="52" width="10" height="28" rx="2" fill="url(#pf-bar)" fillOpacity="0.75" />
      <rect className="il-bar" x="45" y="44" width="10" height="36" rx="2" fill="url(#pf-bar)" style={{ animationDelay: "0.3s" }} />
      <rect className="il-bar" x="61" y="34" width="10" height="46" rx="2" fill="url(#pf-bar)" style={{ animationDelay: "0.6s" }} />
      <g className="il-float">
        <path d="M28 62 L44 48 L56 54 L78 30" stroke="#8ecbe8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#pf-glow)" />
        <path d="M28 62 L44 48 L56 54 L78 30" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M69 30 H78 V39" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="44" cy="48" r="2" fill="#fff" />
        <circle cx="56" cy="54" r="2" fill="#fff" />
      </g>
    </svg>
  );
}

/* ---------------------------------- KAIROS -------------------------------- */

// Il observe — œil détaillé qui scanne + clics détectés
export function IconObserve() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <defs>
        <radialGradient id="ob-iris" cx="0.4" cy="0.4">
          <stop offset="0" stopColor="#8ecbe8" />
          <stop offset="0.6" stopColor="#3b6ba6" />
          <stop offset="1" stopColor="#12233f" />
        </radialGradient>
        <linearGradient id="ob-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#63b3dd" stopOpacity="0" />
          <stop offset="0.5" stopColor="#63b3dd" />
          <stop offset="1" stopColor="#63b3dd" stopOpacity="0" />
        </linearGradient>
        <filter id="ob-glow"><feGaussianBlur stdDeviation="1.4" /></filter>
      </defs>
      <path d="M10 50 H90 M50 26 V74" stroke="#fff" strokeOpacity="0.06" strokeWidth="1" />
      <g className="il-blink">
        <path d="M12 50 C 30 27, 70 27, 88 50 C 70 73, 30 73, 12 50 Z" stroke="#fff" strokeWidth="2.6" />
        <circle cx="50" cy="50" r="14" fill="url(#ob-iris)" />
        <circle cx="50" cy="50" r="14" stroke="#8ecbe8" strokeWidth="1.6" />
        <circle cx="50" cy="50" r="6" fill="#0b1830" />
        <circle cx="46" cy="46" r="2.4" fill="#fff" />
      </g>
      <line className="il-scanx" x1="50" y1="30" x2="50" y2="70" stroke="url(#ob-scan)" strokeWidth="3" filter="url(#ob-glow)" />
      <circle cx="27" cy="66" r="2.4" fill="#8ecbe8" className="il-twinkle" filter="url(#ob-glow)" />
      <circle cx="72" cy="34" r="2.4" fill="#8ecbe8" className="il-twinkle" style={{ animationDelay: "0.7s" }} filter="url(#ob-glow)" />
    </svg>
  );
}

// Il comprend — ampoule qui s'illumine, réseau de filament, halo
export function IconUnderstand() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <defs>
        <radialGradient id="un-glow">
          <stop offset="0" stopColor="#f5d06b" stopOpacity="0.6" />
          <stop offset="1" stopColor="#f5d06b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="46" r="26" fill="url(#un-glow)" className="il-twinkle" />
      <g stroke="#f5b301" strokeWidth="2.6" strokeLinecap="round">
        <line className="il-twinkle" x1="50" y1="6" x2="50" y2="14" />
        <line className="il-twinkle" style={{ animationDelay: "0.25s" }} x1="22" y1="16" x2="27" y2="22" />
        <line className="il-twinkle" style={{ animationDelay: "0.5s" }} x1="78" y1="16" x2="73" y2="22" />
        <line className="il-twinkle" style={{ animationDelay: "0.75s" }} x1="12" y1="40" x2="20" y2="42" />
        <line className="il-twinkle" style={{ animationDelay: "1s" }} x1="88" y1="40" x2="80" y2="42" />
      </g>
      <path d="M38 62 A20 20 0 1 1 62 62 C 60 66, 58 69, 58 73 H42 C 42 69, 40 66, 38 62 Z" stroke="#fff" strokeWidth="2.6" />
      <path d="M43 62 A14 14 0 1 1 57 62" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.4" />
      <path d="M42 78 H58 M45 84 H55" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M44 50 L50 43 L56 50 L50 57 Z" stroke="#f5b301" strokeWidth="1.6" />
      <line x1="50" y1="43" x2="50" y2="34" stroke="#f5b301" strokeWidth="1.6" />
      <circle cx="50" cy="43" r="2.4" fill="#ffd35b" className="il-twinkle" />
      <circle cx="44" cy="50" r="2.4" fill="#ffd35b" className="il-twinkle" style={{ animationDelay: "0.4s" }} />
      <circle cx="56" cy="50" r="2.4" fill="#ffd35b" className="il-twinkle" style={{ animationDelay: "0.8s" }} />
      <circle cx="50" cy="57" r="2.4" fill="#ffd35b" className="il-twinkle" style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

// Il analyse — tableau de bord, aire + courbe qui se trace, loupe qui balaie
export function IconAnalyze() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <defs>
        <linearGradient id="an-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#63b3dd" stopOpacity="0.4" />
          <stop offset="1" stopColor="#63b3dd" stopOpacity="0" />
        </linearGradient>
        <filter id="an-glow"><feGaussianBlur stdDeviation="1.2" /></filter>
      </defs>
      <rect x="12" y="18" width="76" height="60" rx="7" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.4" />
      <path d="M12 46 H88 M12 62 H88" stroke="#fff" strokeOpacity="0.08" strokeWidth="1" />
      <path d="M20 60 L34 48 L46 54 L58 36 L76 44 L76 70 L20 70 Z" fill="url(#an-area)" />
      <path className="il-draw" d="M20 60 L34 48 L46 54 L58 36 L76 44" stroke="#8ecbe8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#an-glow)" style={{ ["--len" as string]: 120 }} />
      <path className="il-draw" d="M20 60 L34 48 L46 54 L58 36 L76 44" stroke="#eaf6fc" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ ["--len" as string]: 120 }} />
      <circle cx="34" cy="48" r="2.6" fill="#fff" className="il-twinkle" />
      <circle cx="58" cy="36" r="2.6" fill="#fff" className="il-twinkle" style={{ animationDelay: "0.6s" }} />
      <g className="il-scanx">
        <circle cx="50" cy="50" r="10" fill="#f5b301" fillOpacity="0.08" stroke="#f5b301" strokeWidth="2.6" />
        <line x1="58" y1="58" x2="66" y2="66" stroke="#f5b301" strokeWidth="2.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
