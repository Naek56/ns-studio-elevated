import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ContactModal, { openContact } from "@/components/site/ContactModal";

/* Accueil « neige » — fond #FFFAFA, encre #0F0F0F.

   Intro : « way » se pose lettre par lettre, chaque lettre arrivant du fond
   de la scène (perspective + translateZ négatif) et non par un fondu sur
   place. Le mot reste optiquement centré pendant qu'il s'allonge : on mesure
   la position de bord droit de chaque lettre une fois la police chargée, puis
   on décale la rangée de la moitié de ce qui reste caché à droite.

   Passation : le mot se dématérialise PENDANT que l'accueil se matérialise.
   Il n'y a jamais d'image morte entre les deux, et le fond ne bouge pas
   puisqu'il est commun aux deux phases — une seule instance dans le DOM,
   jamais conditionnée par la phase, jamais remontée. */

const LETTERS = ["w", "a", "y"] as const;

/* Rythme de l'intro (ms). 2,82 s du chargement à l'accueil posé.
   Le premier jet mettait ~7 s : beaucoup trop. Le deuxième est tombé à 1,80 s :
   l'arrivée des lettres devenait un clignement, on ne la lisait plus. On
   reprend l'écart entre les deux — le rythme est ralenti de 90 %, pas les
   courbes :
     220  départ « w »
     580  départ « a »
     940  départ « y »
    1500  « y » perçue posée
    2100  fin de la respiration, la passation démarre
    2820  accueil posé, intro démontée
   La passation reste calée sur l'atterrissage PERÇU (560 ms) et non sur la fin
   nominale de la transition (1150 ms). Sous --snow-land, cubic-bezier(0.23, 1,
   0.32, 1), la lettre a fait 95 % de sa course en 48,8 % du temps : les 590 ms
   qui restent sont un tassement sub-pixel, et les caler dans le temps d'écran
   serait de l'écran mort. Ils se terminent SOUS la sortie, invisibles.
   Pour régler au feeling, ne toucher que STEP_MS (± 40 ms) : c'est lui qui
   porte le rythme. */
const FIRST_MS = 220;      // avant la première lettre — couvre le premier paint
const STEP_MS = 360;       // écart entre deux DÉPARTS de lettre
const LETTER_MS = 1150;    // = transition transform de .snow-letter-i
const PERCEIVED_MS = 560;  // atterrissage PERÇU (cf. ci-dessus)
const HOLD_MS = 600;       // le mot complet respire
const HANDOFF_MS = 720;    // = la plus longue transition de la passation
const SETTLE_PAD_MS = 50;  // marge avant de retirer le calque d'une lettre posée

const NAV = [
  { label: "Accueil", href: "#top", current: true },
  { label: "Réalisations", href: "#realisations" },
  { label: "Services", href: "#services" },
  { label: "Kairos", href: "#kairos" },
];

export default function Accueil() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [step, setStep] = useState(reduced ? LETTERS.length : 0);
  const [landed, setLanded] = useState(reduced ? LETTERS.length : 0);
  /* "intro" → "handoff" (les deux se croisent) → "home" (l'intro sort du DOM) */
  const [phase, setPhase] = useState<"intro" | "handoff" | "home">(reduced ? "home" : "intro");
  /* bord droit de chaque lettre, relatif au bord gauche du mot */
  const [edges, setEdges] = useState<number[] | null>(null);

  const wordRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  /* Mesure. Deux protections contre le piège du rect transformé :
     — structurelle : le span externe .snow-letter ne porte aucun transform,
       c'est son enfant qui est scalé en Z. Le rect d'un élément est sa propre
       boîte, pas l'union de ses descendants, et un transform n'affecte pas la
       mise en page : on peut donc mesurer en plein vol ;
     — de garde : on ne mesure que pendant la phase "intro", parce que
       .snow-intro-stage porte un scale(1.12) pendant la passation, et celui-là,
       étant un ancêtre, multiplierait bien le rect.
     Les bords sont relatifs au mot, donc invariants au recentrage en cours.
     Jamais d'arrondi : offsetWidth est entier, getBoundingClientRect est
     sub-pixel, et un demi-pixel se voit sur un glyphe de 120 px. */
  useLayoutEffect(() => {
    if (reduced) return;
    let alive = true;
    const measure = () => {
      if (!alive || phaseRef.current !== "intro" || !wordRef.current) return;
      const left = wordRef.current.getBoundingClientRect().left;
      const next = letterRefs.current.map((el) =>
        el ? el.getBoundingClientRect().right - left : 0,
      );
      if (next.every((n) => n > 0)) setEdges(next);
    };
    /* document.fonts.ready attend toutes les polices déclarées, mais on force
       d'abord la graisse exacte du mot-marque : sans ça, la première mesure
       peut tomber sur la police de secours. */
    const fonts = document.fonts;
    Promise.resolve(fonts?.load('580 1em "Instrument Sans"'))
      .then(() => fonts?.ready)
      .then(measure)
      .catch(measure);
    measure();
    window.addEventListener("resize", measure);
    return () => { alive = false; window.removeEventListener("resize", measure); };
  }, [reduced]);

  useEffect(() => {
    document.documentElement.style.background = "#FFFAFA";
    return () => { document.documentElement.style.background = ""; };
  }, []);

  useEffect(() => {
    const reveal = () => {
      (window as unknown as { __wayRevealed?: boolean }).__wayRevealed = true;
      window.dispatchEvent(new Event("way:revealed"));
    };
    if (reduced) { reveal(); return; }

    const timers: number[] = [];
    const handoffAt = FIRST_MS + (LETTERS.length - 1) * STEP_MS + PERCEIVED_MS + HOLD_MS;

    LETTERS.forEach((_, i) => {
      const at = FIRST_MS + i * STEP_MS;
      timers.push(window.setTimeout(() => setStep(i + 1), at));
      timers.push(window.setTimeout(() => setLanded(i + 1), at + LETTER_MS + SETTLE_PAD_MS));
    });
    timers.push(window.setTimeout(() => { setPhase("handoff"); reveal(); }, handoffAt));
    timers.push(window.setTimeout(() => setPhase("home"), handoffAt + HANDOFF_MS));

    /* On ne verrouille jamais l'entrée : un clic ou une touche pendant l'intro
       saute directement à la passation. Ça se fait sans à-coup précisément
       parce que tout est en transitions et pas en keyframes — une transition
       se recible depuis la valeur courante, une keyframe repartirait de zéro. */
    const skip = () => {
      /* uniquement pendant l'intro : sans cette garde, le premier clic sur
         l'accueil rejouerait la passation. */
      if (phaseRef.current !== "intro") return;
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      timers.forEach(window.clearTimeout);
      setStep(LETTERS.length);
      setLanded(LETTERS.length);
      setPhase("handoff");
      reveal();
      timers.push(window.setTimeout(() => setPhase("home"), HANDOFF_MS));
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [reduced]);

  /* La dérive au pointeur : le champ de lumière ne suit pas le curseur, il se
     PENCHE vers lui. L'autre sens (parallaxe inverse) se lit « je me déplace
     dans la scène » ; celui-ci se lit « la lumière se tourne vers moi » — plus
     calme, et c'est lui qui fait que le verre du bouton réfracte quelque chose
     qui change. La boucle s'arrête d'elle-même dès que l'écart passe sous
     0,05 px : coût nul au repos. Dépendances vides — il ne doit jamais se
     remonter, sinon la transformée repart de zéro. */
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const mmMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mmFine = window.matchMedia("(hover: hover) and (pointer: fine)");

    let raf = 0, idle = true, last = 0;
    let tx = 0, ty = 0, gx = 0, gy = 0;
    const MAX_X = 16, MAX_Y = 10;   // px — plafond assumé
    const TAU = 380;                // ms — constante de temps

    const write = () => {
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    };
    const loop = (t: number) => {
      const dt = last ? Math.min(t - last, 50) : 16;
      last = t;
      const k = 1 - Math.exp(-dt / TAU);   // lissage indépendant du frame-rate
      tx += (gx - tx) * k;
      ty += (gy - ty) * k;
      write();
      if (Math.abs(gx - tx) < 0.05 && Math.abs(gy - ty) < 0.05) {
        tx = gx; ty = gy; write(); idle = true; raf = 0; last = 0; return;
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (idle) { idle = false; last = 0; raf = requestAnimationFrame(loop); }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gx = ((e.clientX / window.innerWidth) * 2 - 1) * MAX_X;
      gy = ((e.clientY / window.innerHeight) * 2 - 1) * MAX_Y;
      wake();
    };
    const onOut = () => { gx = 0; gy = 0; wake(); };

    const unbind = () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onOut);
      window.removeEventListener("blur", onOut);
    };
    const bind = () => {
      unbind();
      if (mmMotion.matches || !mmFine.matches) { gx = 0; gy = 0; wake(); return; }
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onOut);
      window.addEventListener("blur", onOut);
    };

    bind();
    mmMotion.addEventListener("change", bind);
    mmFine.addEventListener("change", bind);
    return () => {
      unbind();
      mmMotion.removeEventListener("change", bind);
      mmFine.removeEventListener("change", bind);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Le décalage qui garde le mot centré pendant qu'il se construit : la moitié
     de ce qui reste caché à droite. Exact quelles que soient l'approche et les
     marges, parce qu'il ne compare que des bords réellement rendus — et
     rigoureusement 0 à la dernière étape, par construction et non par arrondi. */
  const shift = (() => {
    if (!edges) return 0;
    const k = Math.max(step, 1);
    if (k >= LETTERS.length) return 0;
    return (edges[LETTERS.length - 1] - edges[k - 1]) / 2;
  })();

  const homeIn = phase !== "intro";

  return (
    <div className="snow relative min-h-[100svh] overflow-hidden">
      <ContactModal />

      {/* Le calque de construction — trois plans d'épure à l'encre sur le blanc.
          UNE seule instance, partagée par l'intro et par l'accueil, donc rien ne
          saute au moment de la passation. Frère de .snow-intro et de .snow-home,
          jamais un enfant : c'est ce qui le laisse entrer dans le backdrop du
          bouton en verre.

          Les trois plans sont des enfants DIRECTS : `.snow-bg > svg` leur donne
          la courbe, l'infini et l'alternance, et les règles `animation: none`
          des media queries d'accessibilité les couvrent sans toucher un
          sélecteur. Un conteneur intermédiaire aurait cassé les trois en
          silence.
          Ce bloc ne doit JAMAIS être remonté ni conditionné par la phase : les
          animations à délai négatif repartiraient de leur origine et tout le
          dessin claquerait à la passation. */}
      <div className="snow-bg" aria-hidden ref={bgRef}>
        {/* 1 · LA GRILLE. Plein cadre, preserveAspectRatio="none" : seules des
            verticales et des horizontales ici, ce sont les deux seules formes
            que ce mode ne déforme pas. Écartements volontairement inégaux, et
            la moitié des traits s'arrêtent avant le bord — c'est ça qui fait
            lire une épure plutôt qu'un papier millimétré.
            Les horizontales à 4,5 et 11 passent DERRIÈRE la nav : sans elles,
            le backdrop-filter du bouton en verre n'aurait qu'un blanc plein à
            ré-échantillonner et la pilule redeviendrait un aplat. */}
        <svg className="snow-geo-grille" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g stroke="rgba(15,15,15,0.085)" strokeWidth="1">
            <path d="M18 0 V100" />
            <path d="M52.5 0 V100" />
            <path d="M81 0 V100" />
            <path d="M0 24.5 H100" />
            <path d="M0 71 H100" />
          </g>
          <g stroke="rgba(15,15,15,0.045)" strokeWidth="1">
            <path d="M6.5 0 V63" />
            <path d="M23.5 17 V100" />
            <path d="M37 0 V41" />
            <path d="M61 29 V100" />
            <path d="M74.5 0 V56" />
            <path d="M93 34 V100" />
            <path d="M0 4.5 H100" />
            <path d="M0 11 H68" />
            <path d="M22 33 H100" />
            <path d="M31 84.5 H100" />
          </g>
        </svg>

        {/* 2 · LES CERCLES. Un carré, donc un cercle reste un cercle sans que
            preserveAspectRatio ait son mot à dire. Deux grands qui se coupent —
            le geste exact de la seconde référence — et un petit, décentré, qui
            empêche la paire de devenir un symbole. Les rayons sont INÉGAUX
            (30 et 26,5) : deux cercles de même rayon qui se coupent, c'est une
            vesica piscis, une figure trop reconnaissable pour un fond. */}
        <svg className="snow-geo-cercles" viewBox="0 0 100 100">
          <g stroke="rgba(15,15,15,0.085)" strokeWidth="1">
            <circle cx="41" cy="50" r="30" />
            <circle cx="63.5" cy="53" r="26.5" />
          </g>
        </svg>

        {/* 3 · LES ANGLES. Rectangles, triangles et obliques, en 16:10 et en
            « slice » pour que les angles restent des angles sur tous les
            formats. Tout est repoussé sur les bords : la bande centrale
            (y de 30 à 60, x de 40 à 120) est vide PAR CONSTRUCTION, c'est
            elle qui reçoit le titre et le chapô.
            Le rectangle bas est incliné de 9° — une seule forme désalignée
            suffit à dire « tracé à la main sur une table », trois feraient
            désordre. */}
        <svg className="snow-geo-angles" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
          <g stroke="rgba(15,15,15,0.075)" strokeWidth="1">
            <rect x="9" y="10" width="26" height="17" />
            <circle cx="141" cy="15" r="8.5" />
            <path d="M118 8 L134 30 L102 30 Z" />
            <rect x="112" y="68" width="31" height="24" transform="rotate(-9 127.5 80)" />
            <path d="M14 96 L36 62 L58 96 Z" />
            {/* Ces deux-là sont au MILIEU du tracé, pas sur ses bords, et
                c'est voulu : en « slice » sur un téléphone, seul le tiers
                central de la largeur reste visible. Sans elles, le mobile
                n'aurait plus que des traits et aurait perdu les rectangles et
                les triangles. Elles restent hors de la bande y 34-62, qui est
                celle du titre. */}
            <rect x="60" y="20" width="20" height="12" />
            <path d="M74 96 L90 70 L106 96 Z" />
          </g>
          <g stroke="rgba(15,15,15,0.045)" strokeWidth="1">
            <path d="M0 40 L22 30" />
            <path d="M146 44 L160 37" />
            <path d="M64 92 L92 78" />
            <path d="M3 56 L3 76" />
            <path d="M156 60 L156 84" />
          </g>
        </svg>
      </div>

      {/* ── intro « way » ── */}
      {phase !== "home" && (
        <div className="snow-intro" aria-hidden>
          <div className={`snow-intro-stage${phase === "handoff" ? " snow-intro--out" : ""}`}>
            <div
              ref={wordRef}
              className="snow-intro-word"
              style={{ transform: `translate3d(${shift}px, 0, 0)` }}
            >
              {LETTERS.map((ch, i) => (
                <span
                  key={ch}
                  ref={(el) => { letterRefs.current[i] = el; }}
                  className={
                    "snow-letter" +
                    (i < step ? " snow-letter--in" : "") +
                    (i < landed ? " snow-letter--landed" : "")
                  }
                >
                  <span className="snow-letter-i">{ch}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── accueil ── */}
      <div
        className={`snow-home${homeIn ? " snow-home--in" : ""}${phase === "home" ? " snow-home--settled" : ""}`}
        /* invisible ne veut pas dire inatteignable : sans `inert`, la
           tabulation entre dans un accueil qu'on ne voit pas encore. */
        {...(phase === "intro" ? ({ inert: "" } as Record<string, string>) : {})}
      >
        {/* Le fondu de la passation est porté par les enfants (.snow-fade) et
            jamais par ce conteneur : une opacité < 1 sur un ancêtre du bouton
            en verre le priverait de son backdrop-filter le temps de la
            passation. Nav sans fond : le verre est réservé au bouton, là où il attire
            l'œil — deux surfaces translucides superposées tueraient la
            lisibilité. Grille 1fr/auto/1fr avec la première colonne vide
            depuis le retrait du logo : c'est elle qui garantit que le groupe
            d'onglets reste centré sur l'axe de la page quelle que soit la
            largeur du bouton. Le header reste HORS de .snow-rise, pour que son
            position: fixed ne soit pas contenu par un ancêtre transformé. */}
        <header className="fixed inset-x-0 top-5 z-40 flex justify-center px-5">
          <nav className="grid w-full max-w-[880px] items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
            <div aria-hidden style={{ gridColumn: 1 }} />

            <div data-nav-links className="snow-fade hidden items-center justify-self-center md:flex" style={{ gridColumn: 2 }}>
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  aria-current={n.current ? "page" : undefined}
                  className="snow-tab snow-ui rounded-full px-3.5 py-2 text-[14px] transition-colors"
                  style={{ color: n.current ? "#0F0F0F" : "rgba(15,15,15,0.68)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0F0F0F")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = n.current ? "#0F0F0F" : "rgba(15,15,15,0.68)")}
                >
                  {n.label}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openContact()}
              className="lg lg-press snow-fade justify-self-end whitespace-nowrap rounded-full px-5 py-2.5 text-[14px]"
              style={{ gridColumn: 3 }}
            >
              <span className="lg-label sm:hidden">Rendez-vous</span>
              <span className="lg-label hidden sm:inline">Prendre rendez-vous</span>
            </button>
          </nav>
        </header>

        {/* Le padding bas remonte le bloc d'environ 3 % de la hauteur d'écran :
            un bloc centré mathématiquement dans un plein écran se lit toujours
            trop bas. C'est la seule asymétrie volontaire de la page, et c'est
            elle qui la fait paraître symétrique. */}
        <main
          id="top"
          className="snow-rise snow-fade relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-[clamp(1rem,4svh,3rem)] text-center"
        >
          <h1 className="snow-display">find your way</h1>

          <p className="snow-lede">
            Studio créatif à Strasbourg. Des sites qu'on refait jusqu'à ce qu'ils soient justes.
          </p>
        </main>
      </div>
    </div>
  );
}
