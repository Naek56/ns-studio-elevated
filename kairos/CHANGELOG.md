# Changelog — Kairos

## Kairos v1

Release initiale du système IA de WAY Agency. Application web privée
(Next.js 14, App Router) déployable sur Vercel.

### Inclus

- **Authentification** — mot de passe maître (`KAIROS_PASSWORD`), session cookie
  signée 24 h, middleware de protection du dashboard. Aucune inscription.
- **Sidebar** — logo WAY Agency, bouton Nouveau Client, liste des clients depuis
  Supabase avec indicateur d'activité vert/rouge, initiales NS.
- **Onglet Rapport** — pipeline 3 appels Claude enchaînés
  (Observateur → Analyste → Stratège) avec captures Screenshotone envoyées à la
  vision, score de santé 0–100 + progression mensuelle, historique des rapports.
- **Onglet Live** — visiteurs actifs en temps réel via Supabase Realtime (page
  courante et durée de session, fenêtre de 5 minutes).
- **Onglet Concurrents** — module Veilleur : comparaison du site client aux
  concurrents via captures, sauvegarde et historique.
- **Onglet Chat Kairos** — chat contextuel ; chargement automatique des 3
  derniers rapports, des events 7 jours et du profil client avant chaque réponse.
- **Gestion des clients & tracker** — `client_id` unique généré à la création,
  `kairos-tracker.js` autonome téléchargeable (clics + position, scroll + pauses
  > 2 s, pages vues + durée, rage clicks, départs ; consentement RGPD),
  ingestion via `POST /api/track`.
- **Base de données** — schéma Supabase (`supabase/schema.sql`) : tables, RLS et
  Realtime.
- **Design** — fond `#0A0A0A`, accent `#FF6B2B`, texte `#E8E6E0`, DM Mono +
  Cormorant Garamond.
- **Modèle IA** — `claude-opus-4-8` (configurable via `ANTHROPIC_MODEL`).
