import {
  OBSERVATEUR_PROMPT,
  ANALYSTE_PROMPT,
  STRATEGE_PROMPT,
  VEILLEUR_PROMPT,
  chatSystemPrompt,
} from "./prompts.ts";
import type { EventsSummary } from "./events.ts";
import type { Screenshot } from "./screenshotone.ts";

const MODEL = Deno.env.get("ANTHROPIC_MODEL") || "claude-opus-4-8";

export type ClientLike = {
  nom: string;
  url: string;
  secteur: string | null;
  objectif: string | null;
};

type TextBlock = { type: "text"; text: string };
type ImageBlock = {
  type: "image";
  source: { type: "base64"; media_type: string; data: string };
};
type Block = TextBlock | ImageBlock;
type Msg = { role: "user" | "assistant"; content: string | Block[] };

/** Appel brut à l'API Messages d'Anthropic (raw HTTP, compatible Deno). */
async function createMessage(opts: {
  system: string;
  messages: Msg[];
  max_tokens: number;
}): Promise<string> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY est requis.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.max_tokens,
      system: opts.system,
      messages: opts.messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic ${res.status}: ${body.slice(0, 500)}`);
  }

  const data = await res.json();
  const blocks: Array<{ type: string; text?: string }> = data.content || [];
  return blocks
    .filter((b) => b.type === "text")
    .map((b) => b.text || "")
    .join("\n")
    .trim();
}

function imageBlocks(shots: Screenshot[]): ImageBlock[] {
  return shots.map((s) => ({
    type: "image",
    source: { type: "base64", media_type: s.media_type, data: s.data },
  }));
}

function profile(c: ClientLike): string {
  return [
    `Nom: ${c.nom}`,
    `URL: ${c.url}`,
    `Secteur: ${c.secteur || "non renseigné"}`,
    `Objectif: ${c.objectif || "non renseigné"}`,
  ].join("\n");
}

// ─── Pipeline rapport ───────────────────────────────────────────────────

export async function runObservation(
  c: ClientLike,
  summary: EventsSummary,
  shots: Screenshot[]
): Promise<string> {
  const text = `Client analysé :
${profile(c)}

Données comportementales agrégées des ${summary.periodeJours} derniers jours (JSON) :
${JSON.stringify(summary, null, 2)}

${shots.length} screenshot(s) des pages du site sont fournis ci-après dans l'ordre :
${shots.map((s, i) => `${i + 1}. ${s.url}`).join("\n")}`;

  return createMessage({
    system: OBSERVATEUR_PROMPT,
    max_tokens: 4000,
    messages: [{ role: "user", content: [{ type: "text", text }, ...imageBlocks(shots)] }],
  });
}

export async function runAnalysis(observation: string, shots: Screenshot[]): Promise<string> {
  return createMessage({
    system: ANALYSTE_PROMPT,
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Voici les faits observés par le module Observateur. Analyse-les en croisant avec les screenshots fournis.\n\n=== OBSERVATION ===\n${observation}`,
          },
          ...imageBlocks(shots),
        ],
      },
    ],
  });
}

export async function runStrategy(
  c: ClientLike,
  summary: EventsSummary,
  observation: string,
  analyse: string
): Promise<{ rapport: string; score: number | null }> {
  const raw = await createMessage({
    system: STRATEGE_PROMPT,
    max_tokens: 8000,
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
  return parseScore(raw);
}

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

// ─── Veilleur ───────────────────────────────────────────────────────────

export async function runVeilleur(
  c: ClientLike,
  clientShots: Screenshot[],
  competitorShots: Screenshot[]
): Promise<string> {
  const content: Block[] = [
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

  return createMessage({
    system: VEILLEUR_PROMPT,
    max_tokens: 4000,
    messages: [{ role: "user", content }],
  });
}

// ─── Chat ───────────────────────────────────────────────────────────────

export async function runChat(
  c: ClientLike,
  rapports: Array<{ created_at: string; score: number | null; rapport: string | null }>,
  summary: EventsSummary,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string
): Promise<string> {
  const context = `=== PROFIL CLIENT ===
${profile(c)}

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

  const messages: Msg[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: userMessage },
  ];

  return createMessage({
    system: chatSystemPrompt(context),
    max_tokens: 2000,
    messages,
  });
}
