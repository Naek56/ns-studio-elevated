# Kairos — le système IA de WAY Agency

Logiciel privé du fondateur de WAY Agency pour analyser les sites web de ses
clients. Observation comportementale, vision IA des pages, rapports stratégiques,
trafic en direct, veille concurrentielle et chat contextuel — propulsés par
Claude (Anthropic), Supabase et Screenshotone.

> Application **Next.js 14 (App Router)** · Tailwind CSS · déployable sur Vercel.

---

## Stack

| Brique           | Rôle                                                            |
| ---------------- | --------------------------------------------------------------- |
| Next.js 14       | App Router, route handlers (API), rendu serveur                 |
| Supabase         | Base de données Postgres + Realtime (onglet Live)               |
| Anthropic Claude | Observateur → Analyste → Stratège, Veilleur, Chat (`claude-opus-4-8`) |
| Screenshotone    | Captures d'écran des pages envoyées à la vision de Claude        |
| Tailwind CSS     | Design noir/orange, DM Mono + Cormorant Garamond                |

---

## 1. Installation

```bash
cd kairos
npm install
cp .env.example .env.local   # puis remplir les variables
```

## 2. Variables d'environnement

| Variable                        | Description                                            |
| ------------------------------- | ------------------------------------------------------ |
| `ANTHROPIC_API_KEY`             | Clé API Anthropic                                      |
| `ANTHROPIC_MODEL`               | (optionnel) modèle Claude, défaut `claude-opus-4-8`    |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL du projet Supabase                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon (utilisée pour le temps réel de l'onglet Live)|
| `SUPABASE_SERVICE_ROLE_KEY`     | Clé service_role (écritures serveur, contourne RLS)    |
| `SCREENSHOTONE_API_KEY`         | Clé d'accès Screenshotone                              |
| `KAIROS_PASSWORD`               | Mot de passe maître de la page de login                |
| `NEXT_PUBLIC_APP_URL`           | (optionnel) URL publique, injectée dans le tracker     |

## 3. Base de données

Dans Supabase → **SQL Editor**, exécuter le contenu de
[`supabase/schema.sql`](./supabase/schema.sql). Ce script crée les tables
(`kairos_clients`, `kairos_events`, `kairos_rapports`, `kairos_concurrents`,
`kairos_messages`), configure RLS et active Supabase Realtime sur les events.

## 4. Développement

```bash
npm run dev
# http://localhost:3000  →  redirige vers /login
```

## 5. Déploiement sur Vercel

1. Importer le dépôt sur Vercel et définir le **Root Directory** sur `kairos/`.
2. Renseigner toutes les variables d'environnement ci-dessus.
3. Déployer. (`vercel.json` étend la durée des fonctions de génération de rapport.)

---

## Fonctionnement

### Authentification

Page de login unique avec mot de passe maître (`KAIROS_PASSWORD`). Aucune
inscription. Session par cookie signé (HMAC-SHA256) de **24 h**. Le middleware
protège `/dashboard`.

### Onglet Rapport

Le bouton **Générer un rapport maintenant** enchaîne 3 appels Claude :

1. **Observateur** — faits purs depuis les events (7 j) + screenshots des pages.
2. **Analyste** — cause, impact conversions, profil psychologique, micro-moment.
3. **Stratège** — rapport structuré (Ce qui s'est passé, Ce que l'IA voit,
   Profils visiteurs, Micro-moments, Voix des visiteurs, Intelligence
   émotionnelle, Problèmes, Plan d'action) + **score de santé 0–100**.

Le rapport est sauvegardé (`kairos_rapports`), affiché immédiatement avec le
score en grand et la progression vs le rapport précédent. L'historique est listé
du plus récent au plus ancien.

### Onglet Live

Visiteurs actifs (5 dernières minutes) via **Supabase Realtime** sur
`kairos_events` : nombre en direct, page courante et durée de session par
visiteur, mise à jour automatique.

### Onglet Concurrents

Saisie des URLs concurrentes → screenshots (client + concurrents) → module
**Veilleur** : ce qu'ils font mieux, ce que le client fait mieux, 3 opportunités
de différenciation. Sauvegardé et historisé.

### Onglet Chat Kairos

Chat contextuel. Avant chaque réponse, Kairos charge automatiquement les 3
derniers rapports, les events des 7 derniers jours et le profil du client, puis
répond.

### Gestion des clients & tracker

À la création d'un client, un `client_id` unique est généré. Le bouton
**Télécharger le script** sert un `kairos-tracker.js` autonome avec le `client_id`
intégré. Une seule balise suffit à l'installer :

```html
<script src="/chemin/kairos-tracker.js" defer></script>
```

Le tracker respecte le RGPD : il attend le consentement avant de démarrer. Pour
l'autoriser, l'une de ces conditions suffit :

```js
window.kairosGrantConsent();             // helper exposé par le script
// ou
localStorage.setItem("kairos_consent", "granted");
// ou un cookie kairos_consent=granted / cookie_consent=accepted
```

Il collecte en silence : clics (élément + position), profondeur de scroll &
pauses > 2 s, pages vues (URL + durée), rage clicks (> 3 clics en < 1 s sur le
même élément) et départs (durée totale de session). Les events sont envoyés vers
`POST /api/track` avec le `client_id` intégré.

---

## Sécurité — note sur Supabase Realtime

L'onglet Live utilise la clé **anon** (publique) côté navigateur. Pour que le
temps réel fonctionne, une policy RLS autorise la **lecture** des events par le
rôle `anon`. Toutes les écritures passent par la clé `service_role` côté serveur.
Si vous préférez ne rien exposer en lecture publique, remplacez l'abonnement
Realtime par un polling via une route serveur authentifiée.
