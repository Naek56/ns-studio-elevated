import { corsHeaders, json } from "../_shared/cors.ts";
import { requireToken } from "../_shared/auth.ts";
import { adminClient } from "../_shared/supabase.ts";
import { takeScreenshots } from "../_shared/screenshotone.ts";
import { runVeilleur, type ClientLike } from "../_shared/anthropic.ts";

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
        .from("kairos_concurrents")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json({ analyses: data || [] });
    }

    if (op === "analyze") {
      const urls = (Array.isArray(body.urls) ? body.urls : [])
        .map((u) => String(u).trim())
        .filter(Boolean)
        .slice(0, 8);
      if (urls.length === 0) {
        return json({ error: "Au moins une URL concurrente est requise." }, 400);
      }

      const { data: client } = await admin
        .from("kairos_clients")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();
      if (!client) return json({ error: "Client introuvable" }, 404);

      const [clientShots, competitorShots] = await Promise.all([
        takeScreenshots([(client as { url: string }).url]),
        takeScreenshots(urls),
      ]);

      const resultat = await runVeilleur(client as ClientLike, clientShots, competitorShots);

      const { data: saved, error } = await admin
        .from("kairos_concurrents")
        .insert({ client_id: clientId, urls, resultat })
        .select("*")
        .single();
      if (error) throw error;

      await admin.from("kairos_clients").update({ concurrents: urls }).eq("client_id", clientId);

      return json({ analyse: saved }, 201);
    }

    return json({ error: "Opération inconnue" }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Erreur serveur" }, 500);
  }
});
