import { supabase } from "./supabase";

const TOKEN_KEY = "kairos_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

/**
 * Appelle une Edge Function Kairos en y joignant le token maître.
 * Sur 401 (token expiré/invalide), nettoie la session et renvoie vers /login.
 */
export async function callFn<T = unknown>(
  name: string,
  body: Record<string, unknown>
): Promise<T> {
  const token = getToken();
  const { data, error } = await supabase.functions.invoke(name, {
    body,
    headers: token ? { "x-kairos-token": token } : {},
  });

  if (error) {
    let message = error.message || "Erreur du serveur.";
    let status = 0;
    // FunctionsHttpError expose la réponse via error.context
    const ctx = (error as { context?: Response }).context;
    if (ctx) {
      status = ctx.status;
      try {
        const parsed = await ctx.clone().json();
        if (parsed?.error) message = parsed.error;
      } catch {
        /* corps non-JSON */
      }
    }
    if (status === 401) {
      clearToken();
      if (location.pathname !== "/login") location.href = "/login";
    }
    throw new Error(message);
  }

  return data as T;
}

/** Connexion : échange le mot de passe maître contre un token. */
export async function login(password: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("kairos-auth", {
    body: { password },
  });
  if (error) {
    const ctx = (error as { context?: Response }).context;
    let message = "Mot de passe incorrect.";
    if (ctx) {
      try {
        const parsed = await ctx.clone().json();
        if (parsed?.error) message = parsed.error;
      } catch {
        /* ignore */
      }
    }
    throw new Error(message);
  }
  if (!data?.token) throw new Error("Réponse d'authentification invalide.");
  setToken(data.token);
}
