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

Les vidéos promotionnelles vivent dans `src/remotion/` et partagent l'identité du
site (noir & blanc, éclipse au rim lumineux, polices Syne / Inter). Elles sont
écrites en React et rendues avec [Remotion](https://www.remotion.dev).

```bash
npm run studio        # ouvre le Studio Remotion (aperçu + édition)
npm run render        # rend la vidéo dans out/WayPromo.mp4
npm run render:still  # exporte une image fixe dans out/WayPromo.png
```

- Composition : **WayPromo** — 1920×1080, 30 fps, 9 s (`src/remotion/WayPromo.tsx`).
- Le code Remotion utilise son propre bundler ; il n'impacte pas le build Vite du site.
- Le premier rendu télécharge Chrome Headless Shell depuis `remotion.media` :
  autorisez cet hôte si votre environnement filtre le réseau sortant.
