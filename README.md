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

## Site séparé : BLUE SMP (serveur Minecraft)

Un second site **indépendant** est disponible sur la route **`/bluesmp`** — une
landing page pour le serveur Minecraft SMP « BLUE SMP » (thème bleu & noir, polices
pixel Minecraft / Fredoka). Il n'affecte pas le site agence.

- Page : `src/pages/BlueSmp.tsx`
- Logo : dépose ton image dans `public/blue-smp-logo.png` (sinon un titre CSS s'affiche)
- Infos à personnaliser (IP, Discord, version) : en haut de `src/pages/BlueSmp.tsx`
