# WAY Agency

Site de **WAY Agency**, studio créatif (web & expériences digitales) qui a aussi créé
**Kairos**, une intelligence qui observe et anticipe votre marché. Bien plus qu'une agence.

## Direction artistique

- **Noir & blanc**, sombre et dramatique, façon expérience (pas un site classique)
- **Fond 3D** : un symbole fort, une éclipse / planète monochrome au rim lumineux
  (React Three Fiber + shader + bloom), persistante en arrière plan
- **Navbar en bas**, narration au scroll, grosses animations
- Polices Syne (titres) et Inter (texte)

## Sections

1. Accueil : « Votre concurrent sait ce qui se passe sur son site. Et vous ? »
2. Le constat (manifeste)
3. Le studio (bien plus qu'une agence)
4. Kairos (l'intelligence)
5. Notre conviction
6. Contact

## Développement

```bash
npm install
npm run dev
npm run build
```

## Vidéo (Remotion)

Les vidéos vivent dans `src/remotion/`, écrites en React et rendues avec
[Remotion](https://www.remotion.dev). Elles partagent l'identité du site
(éclipse au rim lumineux, polices Syne / Inter).

```bash
npm run studio        # ouvre le Studio Remotion (aperçu + édition)
npm run render        # rend WayMotion dans out/WayMotion.mp4
npm run render:promo  # rend WayPromo dans out/WayPromo.mp4
npm run render:still  # exporte une image fixe dans out/WayMotion.png
```

Compositions (`src/remotion/Root.tsx`) :

- **WayMotion** — 1920×1080, 30 fps, ~15 s. Motion design : descente fluide à
  travers le manifeste, transitions « focus-pull » par phrase, fond noir à
  dégradé bleu (`src/remotion/WayMotion.tsx`).
- **WayPromo** — 1920×1080, 30 fps, 9 s. Version courte, noir & blanc
  (`src/remotion/WayPromo.tsx`).

- Le code Remotion utilise son propre bundler ; il n'impacte pas le build Vite du site.
- Le premier rendu télécharge Chrome Headless Shell depuis `remotion.media` :
  autorisez cet hôte si votre environnement filtre le réseau sortant.
