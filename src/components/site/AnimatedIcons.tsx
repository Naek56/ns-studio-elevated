/* Illustrations animées « façon Lottie » (SVG + CSS) qui résument chaque
   pilier. Style soigné, cohérent, avec quelques accents de couleur. */

const box = "h-24 w-24 md:h-28 md:w-28";

/* ---------------------------------- AGENCE -------------------------------- */

// Stratégie — radar / cible qui balaie
export function IconStrategy() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <defs>
        <linearGradient id="il-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#63b3dd" stopOpacity="0.4" />
          <stop offset="1" stopColor="#63b3dd" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="36" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="24" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="12" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M50 14 V86 M14 50 H86" stroke="#fff" strokeOpacity="0.14" strokeWidth="1" />
      <g className="il-spin">
        <path d="M50 50 L50 14 A36 36 0 0 1 79 32 Z" fill="url(#il-sweep)" />
        <line x1="50" y1="50" x2="50" y2="14" stroke="#63b3dd" strokeWidth="2" />
      </g>
      <circle className="il-pulse" cx="66" cy="36" r="3.5" fill="#4a90ff" />
      <circle cx="50" cy="50" r="3" fill="#fff" />
    </svg>
  );
}

// Design — plan de travail, courbe qui se dessine, palette
export function IconDesign() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <rect x="20" y="14" width="60" height="60" rx="7" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.5" />
      <path className="il-draw" d="M28 62 C 40 24, 58 68, 72 30" stroke="#63b3dd" strokeWidth="3" strokeLinecap="round" style={{ ["--len" as string]: 130 }} />
      <g className="il-float">
        <path d="M72 30 l7 -7 4 4 -7 7 z" fill="#fff" />
        <path d="M72 30 l4 4" stroke="#4a90ff" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="32" cy="86" r="3.5" fill="#e0563f" className="il-twinkle" />
      <circle cx="44" cy="86" r="3.5" fill="#4a90ff" className="il-twinkle" style={{ animationDelay: "0.4s" }} />
      <circle cx="56" cy="86" r="3.5" fill="#f5b301" className="il-twinkle" style={{ animationDelay: "0.8s" }} />
      <circle cx="68" cy="86" r="3.5" fill="#2ec28b" className="il-twinkle" style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

// Performance — barres qui montent + flèche de tendance
export function IconPerformance() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <path d="M22 80 H84 M22 80 V22" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
      <rect className="il-bar" x="30" y="52" width="9" height="28" rx="1.5" fill="#4a90ff" fillOpacity="0.5" />
      <rect className="il-bar" x="45" y="44" width="9" height="36" rx="1.5" fill="#4a90ff" fillOpacity="0.75" style={{ animationDelay: "0.3s" }} />
      <rect className="il-bar" x="60" y="34" width="9" height="46" rx="1.5" fill="#63b3dd" style={{ animationDelay: "0.6s" }} />
      <g className="il-float">
        <path d="M28 60 L44 46 L56 52 L77 30" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 30 H77 V39" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ---------------------------------- KAIROS -------------------------------- */

// Il observe — œil qui scanne + clics détectés
export function IconObserve() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <g className="il-blink">
        <path d="M12 50 C 30 28, 70 28, 88 50 C 70 72, 30 72, 12 50 Z" stroke="#fff" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="13" stroke="#63b3dd" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="6" fill="#fff" />
        <circle cx="47" cy="47" r="2" fill="#0e1e3a" />
      </g>
      <line className="il-scanx" x1="50" y1="30" x2="50" y2="70" stroke="#4a90ff" strokeWidth="2" strokeOpacity="0.75" />
      <circle cx="28" cy="66" r="2.4" fill="#63b3dd" className="il-twinkle" />
      <circle cx="70" cy="34" r="2.4" fill="#63b3dd" className="il-twinkle" style={{ animationDelay: "0.7s" }} />
    </svg>
  );
}

// Il comprend — ampoule / réseau qui s'illumine
export function IconUnderstand() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <g stroke="#f5b301" strokeWidth="2.5" strokeLinecap="round">
        <line className="il-twinkle" x1="50" y1="7" x2="50" y2="15" />
        <line className="il-twinkle" style={{ animationDelay: "0.3s" }} x1="23" y1="17" x2="28" y2="23" />
        <line className="il-twinkle" style={{ animationDelay: "0.6s" }} x1="77" y1="17" x2="72" y2="23" />
        <line className="il-twinkle" style={{ animationDelay: "0.9s" }} x1="13" y1="41" x2="21" y2="43" />
        <line className="il-twinkle" style={{ animationDelay: "1.2s" }} x1="87" y1="41" x2="79" y2="43" />
      </g>
      <path d="M38 62 A20 20 0 1 1 62 62 C 60 66, 58 69, 58 73 H42 C 42 69, 40 66, 38 62 Z" stroke="#fff" strokeWidth="2.5" />
      <path d="M42 78 H58 M45 84 H55" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 50 L50 44 L56 50 L50 56 Z" stroke="#f5b301" strokeWidth="1.5" />
      <circle cx="50" cy="44" r="2.2" fill="#f5b301" className="il-twinkle" />
      <circle cx="44" cy="50" r="2.2" fill="#f5b301" className="il-twinkle" style={{ animationDelay: "0.4s" }} />
      <circle cx="56" cy="50" r="2.2" fill="#f5b301" className="il-twinkle" style={{ animationDelay: "0.8s" }} />
      <circle cx="50" cy="56" r="2.2" fill="#f5b301" className="il-twinkle" style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

// Il analyse — tableau de bord, courbe qui se trace, loupe qui balaie
export function IconAnalyze() {
  return (
    <svg viewBox="0 0 100 100" className={box} fill="none">
      <rect x="14" y="20" width="72" height="56" rx="6" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.5" />
      <path d="M14 62 H86" stroke="#fff" strokeOpacity="0.12" />
      <path className="il-draw" d="M20 60 L34 48 L46 54 L58 36 L76 44" stroke="#63b3dd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ ["--len" as string]: 120 }} />
      <circle cx="34" cy="48" r="2.5" fill="#fff" className="il-twinkle" />
      <circle cx="58" cy="36" r="2.5" fill="#fff" className="il-twinkle" style={{ animationDelay: "0.6s" }} />
      <g className="il-scanx">
        <circle cx="50" cy="52" r="9" stroke="#f5b301" strokeWidth="2.5" />
        <line x1="57" y1="59" x2="64" y2="66" stroke="#f5b301" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
