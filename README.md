# BLUE SMP

Site web du serveur **Minecraft SMP "BLUE SMP"**. Page unique (landing page) pour
présenter le serveur, afficher l'IP de connexion et inviter les joueurs à rejoindre
la communauté.

## Direction artistique

- **Bleu & noir** uniquement, avec un **fond bleu dégradé** (façon glace / logo BLUE SMP)
- Polices **"Press Start 2P"** (style pixel Minecraft / "Mojangles") pour les titres et
  **"Fredoka"** (style rond "Oddbods") pour le texte
- Boutons et panneaux façon blocs Minecraft (ombres dures, bordures pixel)
- Particules de neige/glace bleues animées dans le hero

## Sections

1. **Hero** — logo BLUE SMP, IP à copier (Java + Bedrock), stats du serveur
2. **Le serveur** — pourquoi nous rejoindre (survie, économie, communauté, events…)
3. **Rejoindre** — 3 étapes pour se connecter
4. **FAQ** — questions fréquentes
5. **Footer** — IP, version, Discord

## ⚙️ À personnaliser

Ouvre `src/pages/BlueSmp.tsx` et modifie en haut du fichier :

```ts
const SERVER_IP = "play.bluesmp.net"; // ← ton IP réelle
const BEDROCK_PORT = "19132";         // ← ton port Bedrock
const DISCORD_URL = "https://discord.gg/bluesmp"; // ← ton lien Discord
const MC_VERSION = "1.21+";           // ← ta version Minecraft
```

## Développement

```bash
npm install
npm run dev     # serveur de dev
npm run build   # build de production
```
