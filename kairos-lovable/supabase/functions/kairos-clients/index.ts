import { corsHeaders, json } from "../_shared/cors.ts";
import { requireToken } from "../_shared/auth.ts";
import { adminClient } from "../_shared/supabase.ts";

function generateClientId(): string {
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 14);
  return `kai_${rand}`;
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
  const admin = adminClient();

  try {
    if (op === "list") {
      const { data: clients, error } = await admin
        .from("kairos_clients")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;

      const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const { data: recent } = await admin
        .from("kairos_events")
        .select("client_id")
        .gte("created_at", since);
      const activeSet = new Set((recent || []).map((r: { client_id: string }) => r.client_id));

      return json({
        clients: (clients || []).map((c: { client_id: string }) => ({
          ...c,
          active: activeSet.has(c.client_id),
        })),
      });
    }

    if (op === "get") {
      const { data, error } = await admin
        .from("kairos_clients")
        .select("*")
        .eq("client_id", String(body.clientId))
        .maybeSingle();
      if (error) throw error;
      if (!data) return json({ error: "Client introuvable" }, 404);
      return json({ client: data });
    }

    if (op === "create") {
      const nom = String(body.nom || "").trim();
      const url = String(body.url || "").trim();
      if (!nom || !url) return json({ error: "Le nom et l'URL sont requis." }, 400);

      const { data, error } = await admin
        .from("kairos_clients")
        .insert({
          client_id: generateClientId(),
          nom,
          url,
          objectif: String(body.objectif || "").trim() || null,
          secteur: String(body.secteur || "").trim() || null,
          email: String(body.email || "").trim() || null,
          actif: true,
          concurrents: [],
        })
        .select("*")
        .single();
      if (error) throw error;
      return json({ client: data }, 201);
    }

    if (op === "update") {
      const patch: Record<string, unknown> = {};
      for (const key of ["nom", "url", "objectif", "secteur", "email", "actif", "concurrents"]) {
        if (key in body) patch[key] = body[key];
      }
      const { data, error } = await admin
        .from("kairos_clients")
        .update(patch)
        .eq("client_id", String(body.clientId))
        .select("*")
        .single();
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
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Erreur serveur" }, 500);
  }
});
