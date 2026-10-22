# Kairos — version Lovable (Vite + Supabase)

Version de **Kairos** (le système IA de WAY Agency) conçue pour la **preview
Lovable** : front **Vite + React** (même stack que `ns-studio-elevated`) et toute
la logique serveur dans des **Supabase Edge Functions**.

> Le contenu de ce dossier `kairos-lovable/` constitue un projet complet et
> autonome. Pour ton repo dédié, ces fichiers vont à la **racine** du repo.

---

## Stack

| Brique               | Rôle                                                        |
| -------------------- | ----------------------------------------------------------- |
| Vite + React + TS    | Front SPA (preview Lovable), `lovable-tagger` activé         |
| react-router-dom     | Routing (`/login`, `/dashboard`, `/dashboard/:clientId`)    |
| Supabase Postgres    | Base de données + Realtime (onglet Live)                     |
| Supabase Edge Funcs  | Claude, Screenshotone, auth, ingestion (logique serveur)    |
| Anthropic Claude     | `claude-opus-4-8` (configurable via `ANTHROPIC_MODEL`)       |
| Tailwind CSS         | Noir/orange, DM Mono + Cormorant Garamond                   |

---

## Mise en route

### 1. Le repo + Lovable

Crée ton projet sur **Lovable** et connecte-le à **GitHub** (Lovable crée le
repo). Place le contenu de `kairos-lovable/` à la racine de ce repo. La preview
Lovable démarre automatiquement (Vite).

### 2. Connecter Supabase

Dans Lovable, active l'**intégration Supabase** (ou crée un projet Supabase et
renseigne les clés). Lovable injecte alors automatiquement côté front :

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

### 3. Base de données

Applique la migration `supabase/migrations/20260101000000_kairos_init.sql`
(via l'intégration Lovable/Supabase, `supabase db push`, ou en collant le SQL
dans Supabase → SQL Editor). Elle crée les tables, la RLS et active Realtime.

### 4. Déployer les Edge Functions

Le backend tient en **2 fonctions autonomes** sous `supabase/functions/` :

| Fonction | Rôle | JWT |
| --- | --- | --- |
| `kairos-api` | auth, clients, rapports, concurrents, chat (routage par `resource` + `op`) | requis |
| `kairos-track` | ingestion publique du tracker | **désactivé** |

> ⚠️ **Lovable ne déploie pas** les Edge Functions écrites hors de son chat. Il
> faut les déployer soi-même — par l'une des deux méthodes ci-dessous.

**Méthode A — éditeur web Supabase (sans terminal) :**

1. Supabase → **Edge Functions** → **Deploy a new function** → **Via Editor**.
2. Nomme-la `kairos-api`, colle le contenu de
   `supabase/functions/kairos-api/index.ts`, **Deploy**.
3. Recommence avec `kairos-track` (contenu de
   `supabase/functions/kairos-track/index.ts`) et **décoche la vérification du
   JWT** (« Enforce JWT verification » / « Verify JWT ») pour cette fonction.

**Méthode B — CLI Supabase :**

```bash
supabase functions deploy kairos-api
supabase functions deploy kairos-track --no-verify-jwt
```

`kairos-track` est public (appelé par le tracker depuis les sites externes), d'où
le JWT désactivé (déjà déclaré dans `supabase/config.toml`).

### 5. Secrets des Edge Functions

```bash
supabase secrets set \
  ANTHROPIC_API_KEY=sk-ant-... \
  SCREENSHOTONE_API_KEY=... \
  KAIROS_PASSWORD=ton-mot-de-passe-maitre \
  ANTHROPIC_MODEL=claude-opus-4-8
```

(`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont fournis automatiquement aux
fonctions par Supabase.)

### 6. Développement local

```bash
npm install
npm run dev   # http://localhost:8080
```

---

## Fonctionnement

Tout passe par `kairos-api` (routage `resource` + `op`), sauf l'ingestion qui
passe par `kairos-track`.

- **Auth** — page de login + mot de passe maître (`KAIROS_PASSWORD`). `kairos-api`
  (`resource: auth`) renvoie un token signé (HMAC, 24 h) stocké en `localStorage`
  et joint à chaque appel (`x-kairos-token`). Aucune inscription.
- **Rapport** — `resource: report` enchaîne 3 appels Claude (Observateur →
  Analyste → Stratège) avec captures Screenshotone, score de santé 0–100 +
  progression, historique.
- **Live** — abonnement Supabase Realtime sur `kairos_events` (visiteurs actifs
  sur 5 min, page courante, durée).
- **Concurrents** — `resource: competitors` (module Veilleur, captures client +
  concurrents).
- **Chat** — `resource: chat` charge automatiquement 3 rapports, events 7 j et
  profil avant chaque réponse.
- **Tracker** — le bouton « Télécharger le script » génère `kairos-tracker.js`
  côté navigateur avec le `client_id` intégré ; il pointe vers la fonction
  publique `kairos-track`. Installation : `<script src="kairos-tracker.js" defer></script>`.
  Collecte clics + position, scroll + pauses > 2 s, pages vues + durée, rage
  clicks, départs. Respecte le RGPD (attend le consentement) :

  ```js
  window.kairosGrantConsent();            // ou
  localStorage.setItem("kairos_consent", "granted");
  ```

---

## Sécurité

Les écritures passent par les Edge Functions (clé `service_role`, jamais exposée
au navigateur), protégées par le token maître. Seule la **lecture** des events
est ouverte au rôle `anon` (policy RLS), nécessaire au temps réel de l'onglet
Live. Si tu ne veux rien exposer en lecture publique, remplace l'abonnement
Realtime par un appel périodique à une Edge Function authentifiée.

---

## Différence avec la version Next.js

Ce projet est le pendant **Lovable** de la version Next.js (dossier `kairos/`
dans `ns-studio-elevated`). Même produit, même design, mêmes prompts ; seules
l'architecture (Vite + Edge Functions au lieu de Next.js + route handlers) et
l'auth (token `localStorage` au lieu de cookie httpOnly) changent.
