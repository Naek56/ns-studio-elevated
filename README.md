# Kairos

Site vitrine de **Kairos**, la veille qui travaille pour vous : surveillance de votre
marché, de vos concurrents et de vos clients, avec un briefing au bon moment.

## Direction artistique

- **Dark theme**, fond noir
- Palette **noir + orange**, avec touches secondaires **rouge** et **jaune**
- Police **Inter** (sobre), copy courte
- Accueil : fond noir et **figure orange animée qui ondule comme des vagues** (canvas 2D, pas de 3D)

## Sections (plan du scroll)

1. Ouverture (plein écran) : titre + slogan + vague animée
2. Le problème
3. Le chiffre choc (97%)
4. Les 4 modules (cartes cliquables vers une page dédiée)
5. Ce que Kairos fait (Analyste, Stratège, Veilleur)
6. La fréquence (quotidien, hebdo, mensuel)
7. Les plans (Kairos Local 49 €, Kairos Pro 149 €)
8. Promesse finale

Chaque module (`/module/:slug`) a sa propre page de détail.

## Stack technique

- **Vite + React + TypeScript**
- **Tailwind CSS** + shadcn/ui (Radix)
- **Framer Motion** pour les apparitions au scroll
- Vague animée en **canvas 2D** (aucune dépendance 3D)

## Développement

```bash
npm install
npm run dev      # serveur de dev
npm run build    # build de production
npm run preview  # prévisualiser le build
```
