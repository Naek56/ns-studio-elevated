// ════════════════════════════════════════════════════════════════════
//  KAIROS — Edge Function unique (autonome, copier-coller dans Supabase).
//  Gère : auth (login), clients, report, competitors, chat.
//  Routage par { resource, op } dans le corps JSON.
//  L'ingestion publique du tracker est dans la fonction séparée kairos-track.
// ════════════════════════════════════════════════════════════════════
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// ─── CORS ───────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-kairos-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ─── Auth (token HMAC maître, 24h) ──────────────────────────────────────
const SESSION_MAX_AGE = 60 * 60 * 24;
const encoder = new TextEncoder();
function secret(): string {
  return Deno.env.get("KAIROS_PASSWORD") || "kairos-dev-secret-change-me";
}
async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}
function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sign(payload: string): Promise<string> {
  return toHex(await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(payload)));
}
async function createToken(): Promise<string> {
  const expiry = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expiry}.${await sign(expiry)}`;
}
async function verifyToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) return false;
  const expected = await sign(expiry);
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return mismatch === 0;
}

// ─── Supabase admin ─────────────────────────────────────────────────────
function adminClient(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ─── Prompts ────────────────────────────────────────────────────────────
const OBSERVATEUR_PROMPT = `Tu es Kairos module Observateur. Liste uniquement les faits purs observés dans les données et les screenshots sans aucune interprétation. Sois exhaustif et précis.`;
const ANALYSTE_PROMPT = `Tu es Kairos module Analyste. Pour chaque fait observé identifie la cause probable, l'impact sur les conversions, le profil psychologique des visiteurs concernés parmi explorateur chercheur comparateur décideur sceptique, et le micro-moment exact où le visiteur décroche. Croise les données comportementales avec ce que tu vois sur les screenshots.`;
const STRATEGE_PROMPT = `Tu es Kairos module Stratège. Sur la base de l'observation et de l'analyse génère un rapport complet structuré ainsi.

Section CE QUI S'EST PASSÉ : traduit les données en comportement humain compréhensible avec des pourcentages précis.

Section CE QUE L'IA VOIT : décris ce que tu observes visuellement sur les screenshots.

Section PROFILS VISITEURS : identifie la proportion de chaque profil psychologique ce mois-ci (explorateur, chercheur, comparateur, décideur, sceptique).

Section MICRO-MOMENTS : identifie les 3 moments précis où les visiteurs perdent confiance avec l'élément exact et la raison probable.

Section VOIX DES VISITEURS : synthétise en 3 phrases ce que les visiteurs auraient dit s'ils pouvaient parler.

Section INTELLIGENCE ÉMOTIONNELLE : évalue la tonalité émotionnelle de chaque page (confiance, urgence, curiosité, sécurité) et son effet sur les conversions.

Section PROBLÈMES : liste les 3 frictions invisibles les plus critiques.

Section PLAN D'ACTION : liste 3 recommandations concrètes et prioritaires avec pour chacune quoi changer exactement, où sur le site, pourquoi, et l'impact estimé en euros basé sur le trafic réel.

Formate le rapport en Markdown : chaque section commence par un titre de niveau 2 (##) en MAJUSCULES. Sois précis, concret et exploitable.

À la toute dernière ligne de ta réponse, ajoute impérativement une ligne au format exact suivant, et rien d'autre sur cette ligne :
SCORE_SANTE: <un entier de 0 à 100 évaluant la santé globale du site>`;
const VEILLEUR_PROMPT = `Tu es Kairos module Veilleur. Compare le site du client avec ces sites concurrents. Identifie ce qu'ils font mieux, ce que le client fait mieux, et les 3 opportunités de différenciation immédiates. Formate ta réponse en Markdown clair avec des titres de niveau 2 (##).`;

// ─── Résumé des events ──────────────────────────────────────────────────
type RawEvent = { session_id: string | null; type: string; page: string | null; data: Record<string, unknown> };
function num(v: unknown, fallback = 0): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : fallback;
}
function summarizeEvents(events: RawEvent[], periodeJours = 7) {
  const sessions = new Set<string>();
  const pageStats = new Map<string, { vues: number; dureeTotale: number; dureeCount: number; scrollMax: number; rage: number }>();
  const rageElements = new Map<string, number>();
  const clickElements = new Map<string, number>();
  const sessionPages = new Map<string, Set<string>>();
  const sessionDurations = new Map<string, number>();
  let clics = 0, rageClicks = 0, pausesScroll = 0, pagesVues = 0;
  const getPage = (p: string) => {
    let s = pageStats.get(p);
    if (!s) { s = { vues: 0, dureeTotale: 0, dureeCount: 0, scrollMax: 0, rage: 0 }; pageStats.set(p, s); }
    return s;
  };
  for (const ev of events) {
    const sid = ev.session_id || "unknown";
    sessions.add(sid);
    const page = ev.page || (ev.data?.url as string) || "(inconnu)";
    const data = ev.data || {};
    if (!sessionPages.has(sid)) sessionPages.set(sid, new Set());
    switch (ev.type) {
      case "pageview": pagesVues++; getPage(page).vues++; sessionPages.get(sid)!.add(page); break;
      case "pageview_end": {
        const s = getPage(page); const d = num(data.durationMs) / 1000;
        if (d > 0) { s.dureeTotale += d; s.dureeCount++; }
        const scroll = num(data.maxScroll ?? data.depth); if (scroll > s.scrollMax) s.scrollMax = scroll; break;
      }
      case "click": { clics++; const el = String(data.selector || data.element || data.text || "élément").slice(0, 80); clickElements.set(el, (clickElements.get(el) || 0) + 1); break; }
      case "rage_click": { rageClicks++; const el = String(data.selector || data.element || "élément").slice(0, 80); rageElements.set(el, (rageElements.get(el) || 0) + 1); getPage(page).rage++; break; }
      case "scroll": { const s = getPage(page); const depth = num(data.depth); if (depth > s.scrollMax) s.scrollMax = depth; break; }
      case "scroll_pause": pausesScroll++; break;
      case "session_end": { const d = num(data.durationMs) / 1000; if (d > 0) sessionDurations.set(sid, d); const scroll = num(data.maxScroll); if (page) { const s = getPage(page); if (scroll > s.scrollMax) s.scrollMax = scroll; } break; }
    }
  }
  const durationValues = Array.from(sessionDurations.values());
  const dureeSessionMoyenneSec = durationValues.length > 0 ? Math.round(durationValues.reduce((a, b) => a + b, 0) / durationValues.length) : 0;
  const monoPageSessions = Array.from(sessionPages.values()).filter((s) => s.size <= 1).length;
  const tauxRebondEstime = sessions.size > 0 ? Math.round((monoPageSessions / sessions.size) * 100) : 0;
  const pages = Array.from(pageStats.entries())
    .map(([page, s]) => ({ page, vues: s.vues, dureeMoyenneSec: s.dureeCount > 0 ? Math.round(s.dureeTotale / s.dureeCount) : 0, profondeurScrollMax: Math.round(s.scrollMax), rageClicks: s.rage }))
    .sort((a, b) => b.vues - a.vues).slice(0, 12);
  const topList = (m: Map<string, number>) => Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([element, occurrences]) => ({ element, occurrences }));
  return { periodeJours, totalEvents: events.length, sessions: sessions.size, pagesVues, clics, rageClicks, pausesScroll, dureeSessionMoyenneSec, tauxRebondEstime, pages, elementsRageClick: topList(rageElements), elementsCliques: topList(clickElements) };
}
type EventsSummary = ReturnType<typeof summarizeEvents>;

// ─── Screenshots (Screenshotone) ────────────────────────────────────────
type Screenshot = { url: string; media_type: "image/jpeg"; data: string };
function normalizeUrl(url: string): string | null {
  if (!url) return null;
  let v = url.trim(); if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try { return new URL(v).toString(); } catch { return null; }
}
function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer); let binary = ""; const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}
async function takeScreenshot(url: string): Promise<Screenshot | null> {
  const accessKey = Deno.env.get("SCREENSHOTONE_API_KEY");
  if (!accessKey) return null;
  const normalized = normalizeUrl(url); if (!normalized) return null;
  const params = new URLSearchParams({
    access_key: accessKey, url: normalized, format: "jpg", image_quality: "72",
    viewport_width: "1280", viewport_height: "900", full_page: "false",
    block_cookie_banners: "true", block_ads: "true", block_chats: "true",
    cache: "true", cache_ttl: "86400", timeout: "30",
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(`https://api.screenshotone.com/take?${params.toString()}`, { signal: controller.signal });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0) return null;
    return { url: normalized, media_type: "image/jpeg", data: toBase64(buffer) };
  } catch { return null; } finally { clearTimeout(timer); }
}
async function takeScreenshots(urls: string[]): Promise<Screenshot[]> {
  const unique = Array.from(new Set(urls.map(normalizeUrl).filter(Boolean) as string[]));
  const results = await Promise.all(unique.map((u) => takeScreenshot(u)));
  return results.filter((s): s is Screenshot => s !== null);
}

// ─── Anthropic (raw HTTP) ───────────────────────────────────────────────
const MODEL = Deno.env.get("ANTHROPIC_MODEL") || "claude-opus-4-8";
type TextBlock = { type: "text"; text: string };
type ImageBlock = { type: "image"; source: { type: "base64"; media_type: string; data: string } };
type Block = TextBlock | ImageBlock;
type Msg = { role: "user" | "assistant"; content: string | Block[] };
type ClientLike = { nom: string; url: string; secteur: string | null; objectif: string | null };

async function createMessage(opts: { system: string; messages: Msg[]; max_tokens: number }): Promise<string> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY est requis.");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: opts.max_tokens, system: opts.system, messages: opts.messages }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const data = await res.json();
  const blocks: Array<{ type: string; text?: string }> = data.content || [];
  return blocks.filter((b) => b.type === "text").map((b) => b.text || "").join("\n").trim();
}
function imageBlocks(shots: Screenshot[]): ImageBlock[] {
  return shots.map((s) => ({ type: "image", source: { type: "base64", media_type: s.media_type, data: s.data } }));
}
function profile(c: ClientLike): string {
  return [`Nom: ${c.nom}`, `URL: ${c.url}`, `Secteur: ${c.secteur || "non renseigné"}`, `Objectif: ${c.objectif || "non renseigné"}`].join("\n");
}
function parseScore(raw: string): { rapport: string; score: number | null } {
  const match = raw.match(/SCORE_SANTE\s*:\s*(\d{1,3})/i);
  let score: number | null = null;
  if (match) { const n = parseInt(match[1], 10); if (Number.isFinite(n)) score = Math.max(0, Math.min(100, n)); }
  const rapport = raw.replace(/^.*SCORE_SANTE\s*:\s*\d{1,3}.*$/im, "").trim();
  return { rapport, score };
}

// ─── Handlers ───────────────────────────────────────────────────────────
function generateClientId(): string {
  return `kai_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
}
function pagesToCapture(client: ClientLike, topPaths: string[]): string[] {
  const urls: string[] = [client.url];
  let origin = "";
  try { const u = client.url.startsWith("http") ? client.url : `https://${client.url}`; origin = new URL(u).origin; } catch { origin = ""; }
  for (const p of topPaths) {
    if (!p || p === "(inconnu)") continue;
    if (/^https?:\/\//i.test(p)) urls.push(p);
    else if (origin) urls.push(`${origin}${p.startsWith("/") ? "" : "/"}${p}`);
    if (urls.length >= 5) break;
  }
  return Array.from(new Set(urls)).slice(0, 5);
}

async function handleClients(admin: SupabaseClient, body: Record<string, unknown>): Promise<Response> {
  const op = String(body.op || "");
  if (op === "list") {
    const { data: clients, error } = await admin.from("kairos_clients").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const { data: recent } = await admin.from("kairos_events").select("client_id").gte("created_at", since);
    const activeSet = new Set((recent || []).map((r: { client_id: string }) => r.client_id));
    return json({ clients: (clients || []).map((c: { client_id: string }) => ({ ...c, active: activeSet.has(c.client_id) })) });
  }
  if (op === "get") {
    const { data, error } = await admin.from("kairos_clients").select("*").eq("client_id", String(body.clientId)).maybeSingle();
    if (error) throw error;
    if (!data) return json({ error: "Client introuvable" }, 404);
    return json({ client: data });
  }
  if (op === "create") {
    const nom = String(body.nom || "").trim();
    const url = String(body.url || "").trim();
    if (!nom || !url) return json({ error: "Le nom et l'URL sont requis." }, 400);
    const { data, error } = await admin.from("kairos_clients").insert({
      client_id: generateClientId(), nom, url,
      objectif: String(body.objectif || "").trim() || null,
      secteur: String(body.secteur || "").trim() || null,
      email: String(body.email || "").trim() || null,
      actif: true, concurrents: [],
    }).select("*").single();
    if (error) throw error;
    return json({ client: data }, 201);
  }
  if (op === "update") {
    const patch: Record<string, unknown> = {};
    for (const key of ["nom", "url", "objectif", "secteur", "email", "actif", "concurrents"]) if (key in body) patch[key] = body[key];
    const { data, error } = await admin.from("kairos_clients").update(patch).eq("client_id", String(body.clientId)).select("*").single();
    if (error) throw error;
    return json({ client: data });
  }
  if (op === "delete") {
    const id = String(body.clientId);
    await Promise.all([
      admin.from("kairos_events").delete().eq("client_id", id),
      admin.from("kairos_rapports").delete().eq("client_id", id),
      admin.from("kairos_concurrents").delete().eq("client_id", id),
      admin.from("kairos_messages").delete().eq("client_id", id),
    ]);
    const { error } = await admin.from("kairos_clients").delete().eq("client_id", id);
    if (error) throw error;
    return json({ ok: true });
  }
  return json({ error: "Opération inconnue" }, 400);
}

async function handleReport(admin: SupabaseClient, body: Record<string, unknown>): Promise<Response> {
  const op = String(body.op || "");
  const clientId = String(body.clientId || "");
  if (op === "list") {
    const { data, error } = await admin.from("kairos_rapports").select("*").eq("client_id", clientId).order("created_at", { ascending: false });
    if (error) throw error;
    return json({ rapports: data || [] });
  }
  if (op === "generate") {
    const { data: client } = await admin.from("kairos_clients").select("*").eq("client_id", clientId).maybeSingle();
    if (!client) return json({ error: "Client introuvable" }, 404);
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const { data: events } = await admin.from("kairos_events").select("session_id,type,page,data").eq("client_id", clientId).gte("created_at", since).order("created_at", { ascending: true }).limit(5000);
    const summary = summarizeEvents((events || []) as RawEvent[], 7);
    const c = client as ClientLike;
    const urls = pagesToCapture(c, summary.pages.map((p) => p.page));
    const shots = await takeScreenshots(urls);

    const obsText = `Client analysé :
${profile(c)}

Données comportementales agrégées des ${summary.periodeJours} derniers jours (JSON) :
${JSON.stringify(summary, null, 2)}

${shots.length} screenshot(s) des pages du site sont fournis ci-après :
${shots.map((s, i) => `${i + 1}. ${s.url}`).join("\n")}`;
    const observation = await createMessage({ system: OBSERVATEUR_PROMPT, max_tokens: 4000, messages: [{ role: "user", content: [{ type: "text", text: obsText }, ...imageBlocks(shots)] }] });

    const analyse = await createMessage({ system: ANALYSTE_PROMPT, max_tokens: 4000, messages: [{ role: "user", content: [{ type: "text", text: `Voici les faits observés par le module Observateur. Analyse-les en croisant avec les screenshots fournis.\n\n=== OBSERVATION ===\n${observation}` }, ...imageBlocks(shots)] }] });

    const stratText = `Client : ${c.nom} — ${c.url}
Trafic réel sur ${summary.periodeJours} jours : ${summary.sessions} sessions, ${summary.pagesVues} pages vues, durée de session moyenne ${summary.dureeSessionMoyenneSec}s, taux de rebond estimé ${summary.tauxRebondEstime}%.

=== OBSERVATION ===
${observation}

=== ANALYSE ===
${analyse}

Génère maintenant le rapport complet selon la structure demandée.`;
    const raw = await createMessage({ system: STRATEGE_PROMPT, max_tokens: 8000, messages: [{ role: "user", content: [{ type: "text", text: stratText }] }] });
    const { rapport, score } = parseScore(raw);

    const { data: saved, error } = await admin.from("kairos_rapports").insert({ client_id: clientId, observation, analyse, rapport, score }).select("*").single();
    if (error) throw error;
    return json({ rapport: saved }, 201);
  }
  return json({ error: "Opération inconnue" }, 400);
}

async function handleCompetitors(admin: SupabaseClient, body: Record<string, unknown>): Promise<Response> {
  const op = String(body.op || "");
  const clientId = String(body.clientId || "");
  if (op === "list") {
    const { data, error } = await admin.from("kairos_concurrents").select("*").eq("client_id", clientId).order("created_at", { ascending: false });
    if (error) throw error;
    return json({ analyses: data || [] });
  }
  if (op === "analyze") {
    const urls = (Array.isArray(body.urls) ? body.urls : []).map((u) => String(u).trim()).filter(Boolean).slice(0, 8);
    if (urls.length === 0) return json({ error: "Au moins une URL concurrente est requise." }, 400);
    const { data: client } = await admin.from("kairos_clients").select("*").eq("client_id", clientId).maybeSingle();
    if (!client) return json({ error: "Client introuvable" }, 404);
    const c = client as ClientLike;
    const [clientShots, competitorShots] = await Promise.all([takeScreenshots([c.url]), takeScreenshots(urls)]);
    const content: Block[] = [
      { type: "text", text: `Client : ${c.nom} — ${c.url} (secteur : ${c.secteur || "non renseigné"}).\n\nScreenshot(s) du SITE DU CLIENT :\n${clientShots.map((s, i) => `${i + 1}. ${s.url}`).join("\n") || "(aucun)"}` },
      ...imageBlocks(clientShots),
      { type: "text", text: `Screenshot(s) des SITES CONCURRENTS :\n${competitorShots.map((s, i) => `${i + 1}. ${s.url}`).join("\n") || "(aucun)"}` },
      ...imageBlocks(competitorShots),
    ];
    const resultat = await createMessage({ system: VEILLEUR_PROMPT, max_tokens: 4000, messages: [{ role: "user", content }] });
    const { data: saved, error } = await admin.from("kairos_concurrents").insert({ client_id: clientId, urls, resultat }).select("*").single();
    if (error) throw error;
    await admin.from("kairos_clients").update({ concurrents: urls }).eq("client_id", clientId);
    return json({ analyse: saved }, 201);
  }
  return json({ error: "Opération inconnue" }, 400);
}

async function handleChat(admin: SupabaseClient, body: Record<string, unknown>): Promise<Response> {
  const op = String(body.op || "");
  const clientId = String(body.clientId || "");
  if (op === "history") {
    const { data, error } = await admin.from("kairos_messages").select("*").eq("client_id", clientId).order("created_at", { ascending: true }).limit(200);
    if (error) throw error;
    return json({ messages: data || [] });
  }
  if (op === "send") {
    const userMessage = String(body.message || "").trim();
    if (!userMessage) return json({ error: "Message vide." }, 400);
    const { data: client } = await admin.from("kairos_clients").select("*").eq("client_id", clientId).maybeSingle();
    if (!client) return json({ error: "Client introuvable" }, 404);
    const c = client as ClientLike;
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const [rapportsRes, eventsRes, historyRes] = await Promise.all([
      admin.from("kairos_rapports").select("created_at,score,rapport").eq("client_id", clientId).order("created_at", { ascending: false }).limit(3),
      admin.from("kairos_events").select("session_id,type,page,data").eq("client_id", clientId).gte("created_at", since).limit(5000),
      admin.from("kairos_messages").select("role,content").eq("client_id", clientId).order("created_at", { ascending: true }).limit(40),
    ]);
    const summary = summarizeEvents((eventsRes.data || []) as RawEvent[], 7);
    const rapports = (rapportsRes.data || []) as Array<{ created_at: string; score: number | null; rapport: string | null }>;
    const history = (historyRes.data || []) as Array<{ role: "user" | "assistant"; content: string }>;
    const context = `=== PROFIL CLIENT ===
${profile(c)}

=== DONNÉES COMPORTEMENTALES (${summary.periodeJours} derniers jours) ===
${JSON.stringify(summary, null, 2)}

=== 3 DERNIERS RAPPORTS ===
${rapports.length === 0 ? "Aucun rapport généré pour l'instant." : rapports.map((r, i) => `--- Rapport ${i + 1} (${new Date(r.created_at).toLocaleDateString("fr-FR")}, score ${r.score ?? "n/a"}) ---\n${(r.rapport || "").slice(0, 6000)}`).join("\n\n")}`;
    const messages: Msg[] = [...history.map((m) => ({ role: m.role, content: m.content })), { role: "user" as const, content: userMessage }];
    const reply = await createMessage({
      system: `Tu es Kairos, l'assistant IA de WAY Agency. Tu connais parfaitement ce client, voici ses données et ses rapports. Réponds aux questions sur son site avec précision et concision.\n\n${context}`,
      max_tokens: 2000, messages,
    });
    await admin.from("kairos_messages").insert([
      { client_id: clientId, role: "user", content: userMessage },
      { client_id: clientId, role: "assistant", content: reply },
    ]);
    return json({ reply });
  }
  return json({ error: "Opération inconnue" }, 400);
}

// ─── Routeur ────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Requête invalide" }, 400); }

  const resource = String(body.resource || "");

  // Auth (login) — ne nécessite pas de token.
  if (resource === "auth") {
    const expected = Deno.env.get("KAIROS_PASSWORD");
    if (!expected) return json({ error: "KAIROS_PASSWORD n'est pas configuré." }, 500);
    const password = typeof body.password === "string" ? body.password : "";
    if (!password || password !== expected) return json({ error: "Mot de passe incorrect." }, 401);
    return json({ token: await createToken() });
  }

  // Tout le reste nécessite le token maître.
  if (!(await verifyToken(req.headers.get("x-kairos-token")))) return json({ error: "Non autorisé" }, 401);

  const admin = adminClient();
  try {
    switch (resource) {
      case "clients": return await handleClients(admin, body);
      case "report": return await handleReport(admin, body);
      case "competitors": return await handleCompetitors(admin, body);
      case "chat": return await handleChat(admin, body);
      default: return json({ error: "Ressource inconnue" }, 400);
    }
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Erreur serveur" }, 500);
  }
});
