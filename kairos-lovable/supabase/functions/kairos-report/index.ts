import { corsHeaders, json } from "../_shared/cors.ts";
import { requireToken } from "../_shared/auth.ts";
import { adminClient } from "../_shared/supabase.ts";
import { summarizeEvents, type RawEvent } from "../_shared/events.ts";
import { takeScreenshots } from "../_shared/screenshotone.ts";
import { runObservation, runAnalysis, runStrategy, type ClientLike } from "../_shared/anthropic.ts";

type ClientRow = ClientLike & { client_id: string };

function pagesToCapture(client: ClientRow, topPaths: string[]): string[] {
  const urls: string[] = [client.url];
  let origin = "";
  try {
    const u = client.url.startsWith("http") ? client.url : `https://${client.url}`;
    origin = new URL(u).origin;
  } catch {
    origin = "";
  }
  for (const p of topPaths) {
    if (!p || p === "(inconnu)") continue;
    if (/^https?:\/\//i.test(p)) urls.push(p);
    else if (origin) urls.push(`${origin}${p.startsWith("/") ? "" : "/"}${p}`);
    if (urls.length >= 5) break;
  }
  return Array.from(new Set(urls)).slice(0, 5);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!(await requireToken(req))) return json({ error: "Non autorisé" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Requête invalide" }, 400);
  }

  const op = String(body.op || "");
  const clientId = String(body.clientId || "");
  const admin = adminClient();

  try {
    if (op === "list") {
      const { data, error } = await admin
        .from("kairos_rapports")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json({ rapports: data || [] });
    }

    if (op === "generate") {
      const { data: client } = await admin
        .from("kairos_clients")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();
      if (!client) return json({ error: "Client introuvable" }, 404);

      const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const { data: events } = await admin
        .from("kairos_events")
        .select("session_id,type,page,data")
        .eq("client_id", clientId)
        .gte("created_at", since)
        .order("created_at", { ascending: true })
        .limit(5000);

      const summary = summarizeEvents((events || []) as RawEvent[], 7);
      const urls = pagesToCapture(client as ClientRow, summary.pages.map((p) => p.page));
      const screenshots = await takeScreenshots(urls);

      const observation = await runObservation(client as ClientRow, summary, screenshots);
      const analyse = await runAnalysis(observation, screenshots);
      const { rapport, score } = await runStrategy(client as ClientRow, summary, observation, analyse);

      const { data: saved, error } = await admin
        .from("kairos_rapports")
        .insert({ client_id: clientId, observation, analyse, rapport, score })
        .select("*")
        .single();
      if (error) throw error;
      return json({ rapport: saved }, 201);
    }

    return json({ error: "Opération inconnue" }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Erreur serveur" }, 500);
  }
});
