import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ContactModal, { openContact } from "@/components/site/ContactModal";
import { Tiles } from "@/components/ui/tiles";
import WayMark from "@/components/site/WayMark";

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

/* Rythme de l'intro (ms). 3,38 s du chargement à l'accueil posé.
   Le premier jet mettait ~7 s : beaucoup trop. Le deuxième est tombé à 1,80 s :
   l'arrivée des lettres devenait un clignement, on ne la lisait plus. On a
   repris l'écart entre les deux (2,82 s), et ce réglage-ci le ralentit encore
   d'un cinquième — la demande était « un peu plus lent », donc un facteur, pas
   une refonte : TOUTES les durées sont multipliées par 1,22, celles du script
   comme celles des transitions CSS. Un rythme se ralentit en entier ou pas du
   tout ; n'allonger que les attentes, en laissant les courbes à leur vitesse,
   donnerait trois lettres qui claquent séparées par des blancs.
     260  départ « w »
     700  départ « a »
    1140  départ « y »
    1820  « y » perçue posée
    2560  fin de la respiration, la passation démarre
    3380  accueil posé, intro démontée
   La passation reste calée sur l'atterrissage PERÇU (680 ms) et non sur la fin
   nominale de la transition (1400 ms). Sous --snow-land, cubic-bezier(0.23, 1,
   0.32, 1), la lettre a fait 95 % de sa course en 48,8 % du temps : les 720 ms
   qui restent sont un tassement sub-pixel, et les caler dans le temps d'écran
   serait de l'écran mort. Ils se terminent SOUS la sortie, invisibles.
   Pour régler au feeling, ne toucher que STEP_MS (± 40 ms) : c'est lui qui
   porte le rythme. */
const FIRST_MS = 260;      // avant la première lettre — couvre le premier paint
const STEP_MS = 440;       // écart entre deux DÉPARTS de lettre
const LETTER_MS = 1400;    // = transition transform de .snow-letter-i
const PERCEIVED_MS = 680;  // atterrissage PERÇU (cf. ci-dessus)
const HOLD_MS = 740;       // le mot complet respire
const HANDOFF_MS = 820;    // = la plus longue transition de la passation
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

      {/* Le fond : la grille. UNE seule instance, partagée par l'intro et par
          l'accueil, donc rien ne saute au moment de la passation. Frère de
          .snow-intro et de .snow-home, jamais un enfant : c'est ce qui le
          laisse entrer dans le backdrop du bouton en verre.

          ATTENTION AUX NOMS DE PROPS : ils sont inversés par rapport à ce
          qu'on voit. `rows` compte les éléments du conteneur flex, qui se
          posent HORIZONTALEMENT — c'est donc le nombre de colonnes à l'écran.
          `cols` compte leurs enfants, empilés verticalement : c'est le nombre
          de lignes.

          TROIS RÉGLAGES PASSENT PAR tileClassName, ET AUCUN NE TOUCHE AU
          COMPOSANT. `cn` est bâti sur twMerge, donc la dernière classe gagne
          sur une même propriété — on peut écraser la taille et les bordures
          par l'extérieur :
            · w-14/md:w-20 remplace le module de 36/48 px par 56/80 px ;
            · border-0 efface TOUTES les bordures. La verticale n'est plus un
              filet plat : c'est un dégradé peint dans la case elle-même, par
              `.snow-tiles > div > div` dans la feuille de style. Une bordure ne
              peut pas être un dégradé, et c'est le dégradé qui fait la lame.
          Les cases restent des cases : invisibles, mais toujours survolables.
          C'est ce qui fait qu'un rectangle s'allume entre deux lames — et
          comme la lame est peinte DANS la case, elle dérive avec elle. Une
          grille de survol immobile sous des lignes qui bougent se verrait au
          premier passage de souris. */}
      <div className="snow-bg" aria-hidden>
        {/* LES MOTIFS — six champs de rubans en dégradé, portés par deux
            calques, qui traversent lentement la page et battent entre eux.
            Une période ne contient plus un ruban mais une phrase — un large
            puis un fin, une onde seule, un doublet serré suivi d'un halo
            lointain — et chaque calque respire sa propre opacité sur une
            période longue qui n'est celle d'aucune autre. Des champs
            s'éteignent, d'autres reviennent, jamais dans le même ordre.

            L'ORDRE DANS LE DOM EST LE PROPOS. Ce calque-ci est AVANT <Tiles>,
            donc SOUS les lames : une lumière qui vient du fond et que le verre
            filtre. L'autre est après, donc DESSUS : un reflet posé sur la
            surface. Les deux à la même place donneraient deux fois la même
            chose et la page resterait plate. */}
        <i className="snow-motif snow-motif-a" />

        <Tiles
          rows={30}
          cols={18}
          tileSize="md"
          className="snow-tiles"
          tileClassName="w-14 h-14 md:w-20 md:h-20 border-0"
        />

        {/* Le second calque, par-dessus les lames — il les teinte au passage.
            Un motif qui n'atteint pas ce qu'il traverse n'est pas une lumière :
            posé uniquement dessous, il n'aurait coloré que les intervalles
            blancs et les arêtes seraient restées grises au milieu du champ. */}
        <i className="snow-motif snow-motif-b" />
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
            passation. Nav sans fond : le verre est réservé au bouton, là où il
            attire l'œil — deux surfaces translucides superposées tueraient la
            lisibilité. Le header reste HORS de .snow-rise, pour que son
            position: fixed ne soit pas contenu par un ancêtre transformé.

            CE QUI EST ALIGNÉ, ET AVEC QUOI. La barre est une boîte de 880 px
            centrée sur l'axe de la page, donc sur celui du titre, et elle est
            désormais TENUE À SES DEUX BOUTS : la marque et les onglets à
            gauche, le CTA à droite. C'est ce qui règle d'un coup les deux
            défauts d'avant — le bouton collé aux onglets (8 px les séparaient),
            et une barre dont l'encre s'arrêtait au milieu parce que le côté
            gauche était vide. Ici l'encre commence au premier pixel de la
            mascotte et finit au bord de la pilule : les deux sont des bords
            pleins, donc centrer la boîte revient à centrer l'encre, sans la
            compensation optique que réclamait la version précédente.

            La mascotte porte un lien vers le haut de page ; le mot « way » est
            composé dans la police du site plutôt que vectorisé, pour rester net
            à toutes les tailles et suivre la graisse du reste de l'interface. */}
        <header className="fixed inset-x-0 top-5 z-40 flex justify-center px-5">
          <nav className="snow-nav flex w-full max-w-[880px] items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <a href="#top" aria-label="WAY Agency — retour en haut" className="snow-mark snow-fade">
                <WayMark className="snow-mark-signe" />
                <span className="snow-mark-mot">way</span>
              </a>

              <div data-nav-links className="snow-fade hidden items-center md:flex">
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
            </div>

            <button
              type="button"
              onClick={() => openContact()}
              className="lg lg-press snow-fade whitespace-nowrap rounded-full px-5 py-2.5 text-[14px]"
            >
              <span className="lg-label sm:hidden">Rendez-vous</span>
              <span className="lg-label hidden sm:inline">Prendre rendez-vous</span>
            </button>
          </nav>
        </header>

        {/* Le héros ne contient plus que le titre. Le padding bas le remonte
            d'environ 3 % de la hauteur d'écran : un bloc centré
            mathématiquement dans un plein écran se lit toujours trop bas.
            C'est la seule asymétrie volontaire de la page, et c'est elle qui
            la fait paraître symétrique. */}
        <main
          id="top"
          className="snow-rise snow-fade relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-[clamp(1rem,4svh,3rem)] text-center"
        >
          <h1 className="snow-display">find your way</h1>
        </main>
      </div>
    </div>
  );
}
