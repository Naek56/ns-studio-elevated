import { corsHeaders, json } from "../_shared/cors.ts";
import { createToken } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return json({ error: "Requête invalide" }, 400);
  }

  const expected = Deno.env.get("KAIROS_PASSWORD");
  if (!expected) return json({ error: "KAIROS_PASSWORD n'est pas configuré." }, 500);
  if (!password || password !== expected) {
    return json({ error: "Mot de passe incorrect." }, 401);
  }

  return json({ token: await createToken() });
});
