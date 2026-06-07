# NS Intelligence (NSI)

Site vitrine immersif **3D** pour **NS Intelligence** — agence de création de sites web
haut de gamme et pilotés par la data.

> « Vos concurrents savent ce qui se passe sur leurs sites. *Et vous ?* »

## L'expérience

- **Intro 3D pilotée au scroll** : le visiteur arrive face à une porte fermée dans une pièce
  sombre, la lumière s'en échappe. En scrollant, la porte s'ouvre et la caméra s'avance
  jusqu'à pénétrer dans la lumière — puis débouche sur la page d'accueil.
- **Page d'accueil** : fond animé orange & noir, boutons *liquid glass*, sections Approche,
  Services, Intelligence (tableau de bord analytique), Réalisations, Process et contact.

## Stack technique

- **Vite + React + TypeScript**
- **Tailwind CSS** + shadcn/ui (Radix)
- **React Three Fiber** + **drei** + **postprocessing** (Bloom) pour la scène 3D
- **Framer Motion** pour le scroll et les animations d'interface

## Développement

```bash
npm install
npm run dev      # serveur de dev
npm run build    # build de production
npm run preview  # prévisualiser le build
```

## Structure

```
src/
  components/
    intro/      # DoorIntro — pilotage scroll de l'expérience 3D
    three/      # DoorScene — scène React Three Fiber (porte, lumière, bloom)
    site/       # sections de la page d'accueil + fond animé
    ui/         # composants UI (dont le bouton liquid glass)
  pages/        # Index (compose l'intro + la home), NotFound
```

> Note : ce dépôt s'appelle encore `ns-studio-elevated` côté GitHub. Tu peux le renommer
> en `site-ns-intelligence` (Settings → Rename) — le contenu, lui, est 100 % NSI.
