import Anthropic from "@anthropic-ai/sdk";
import {
  OBSERVATEUR_PROMPT,
  ANALYSTE_PROMPT,
  STRATEGE_PROMPT,
  VEILLEUR_PROMPT,
  chatSystemPrompt,
} from "./prompts";
import type { EventsSummary } from "./events";
import type { KairosClient, KairosMessage, KairosRapport, Screenshot } from "./types";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

function client(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY est requis.");
  }
  return new Anthropic();
}

/** Concatène les blocs texte d'une réponse Claude. */
function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

/** Transforme des screenshots en blocs image pour l'API vision. */
function imageBlocks(screenshots: Screenshot[]): Anthropic.ImageBlockParam[] {
  return screenshots.map((s) => ({
    type: "image",
    source: { type: "base64", media_type: s.media_type, data: s.data },
  }));
}

function clientProfileText(c: KairosClient): string {
  return [
    `Nom: ${c.nom}`,
    `URL: ${c.url}`,
    `Secteur: ${c.secteur || "non renseigné"}`,
    `Objectif: ${c.objectif || "non renseigné"}`,
  ].join("\n");
}

// ─── Pipeline de rapport (3 appels enchaînés) ───────────────────────────

/** Appel 1 — Observation : faits purs depuis les données + screenshots. */
export async function runObservation(
  c: KairosClient,
  summary: EventsSummary,
  screenshots: Screenshot[]
): Promise<string> {
  const text = `Client analysé :
${clientProfileText(c)}

Données comportementales agrégées des ${summary.periodeJours} derniers jours (JSON) :
${JSON.stringify(summary, null, 2)}

${screenshots.length} screenshot(s) des pages du site sont fournis ci-après dans l'ordre :
${screenshots.map((s, i) => `${i + 1}. ${s.url}`).join("\n")}`;

  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: OBSERVATEUR_PROMPT,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text }, ...imageBlocks(screenshots)],
      },
    ],
  });
  return extractText(msg);
}

/** Appel 2 — Analyse : cause, impact, profil psychologique, micro-moment. */
export async function runAnalysis(
  observation: string,
  screenshots: Screenshot[]
): Promise<string> {
  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: ANALYSTE_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Voici les faits observés par le module Observateur. Analyse-les en croisant avec les screenshots fournis.\n\n=== OBSERVATION ===\n${observation}`,
          },
          ...imageBlocks(screenshots),
        ],
      },
    ],
  });
  return extractText(msg);
}

/** Appel 3 — Stratégie : rapport structuré complet + score de santé. */
export async function runStrategy(
  c: KairosClient,
  summary: EventsSummary,
  observation: string,
  analyse: string
): Promise<{ rapport: string; score: number | null }> {
  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: STRATEGE_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Client : ${c.nom} — ${c.url}
Trafic réel sur ${summary.periodeJours} jours : ${summary.sessions} sessions, ${summary.pagesVues} pages vues, durée de session moyenne ${summary.dureeSessionMoyenneSec}s, taux de rebond estimé ${summary.tauxRebondEstime}%.

=== OBSERVATION ===
${observation}

=== ANALYSE ===
${analyse}

Génère maintenant le rapport complet selon la structure demandée.`,
          },
        ],
      },
    ],
  });

  const raw = extractText(msg);
  return parseScore(raw);
}

/** Extrait la ligne SCORE_SANTE: NN et la retire du corps du rapport. */
function parseScore(raw: string): { rapport: string; score: number | null } {
  const match = raw.match(/SCORE_SANTE\s*:\s*(\d{1,3})/i);
  let score: number | null = null;
  if (match) {
    const n = parseInt(match[1], 10);
    if (Number.isFinite(n)) score = Math.max(0, Math.min(100, n));
  }
  const rapport = raw.replace(/^.*SCORE_SANTE\s*:\s*\d{1,3}.*$/im, "").trim();
  return { rapport, score };
}

// ─── Veilleur (concurrents) ─────────────────────────────────────────────

export async function runVeilleur(
  c: KairosClient,
  clientShots: Screenshot[],
  competitorShots: Screenshot[]
): Promise<string> {
  const content: Array<Anthropic.TextBlockParam | Anthropic.ImageBlockParam> = [
    {
      type: "text",
      text: `Client : ${c.nom} — ${c.url} (secteur : ${c.secteur || "non renseigné"}).

Screenshot(s) du SITE DU CLIENT :
${clientShots.map((s, i) => `${i + 1}. ${s.url}`).join("\n") || "(aucun)"}`,
    },
    ...imageBlocks(clientShots),
    {
      type: "text",
      text: `Screenshot(s) des SITES CONCURRENTS :
${competitorShots.map((s, i) => `${i + 1}. ${s.url}`).join("\n") || "(aucun)"}`,
    },
    ...imageBlocks(competitorShots),
  ];

  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: VEILLEUR_PROMPT,
    messages: [{ role: "user", content }],
  });
  return extractText(msg);
}

// ─── Chat Kairos ────────────────────────────────────────────────────────

export async function runChat(
  c: KairosClient,
  rapports: KairosRapport[],
  summary: EventsSummary,
  history: KairosMessage[],
  userMessage: string
): Promise<string> {
  const context = `=== PROFIL CLIENT ===
${clientProfileText(c)}

=== DONNÉES COMPORTEMENTALES (${summary.periodeJours} derniers jours) ===
${JSON.stringify(summary, null, 2)}

=== 3 DERNIERS RAPPORTS ===
${
  rapports.length === 0
    ? "Aucun rapport généré pour l'instant."
    : rapports
        .map(
          (r, i) =>
            `--- Rapport ${i + 1} (${new Date(r.created_at).toLocaleDateString("fr-FR")}, score ${
              r.score ?? "n/a"
            }) ---\n${(r.rapport || "").slice(0, 6000)}`
        )
        .join("\n\n")
}`;

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ];

  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: chatSystemPrompt(context),
    messages,
  });
  return extractText(msg);
}
