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

async function readError(error: unknown): Promise<{ message: string; status: number }> {
  let message = (error as { message?: string })?.message || "Erreur du serveur.";
  let status = 0;
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
  return { message, status };
}

/**
 * Appelle la fonction unique `kairos-api` (routage par resource + op),
 * en y joignant le token maître. Sur 401, nettoie la session → /login.
 */
export async function callApi<T = unknown>(
  resource: string,
  op: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const token = getToken();
  const { data, error } = await supabase.functions.invoke("kairos-api", {
    body: { resource, op, ...payload },
    headers: token ? { "x-kairos-token": token } : {},
  });

  if (error) {
    const { message, status } = await readError(error);
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
  const { data, error } = await supabase.functions.invoke("kairos-api", {
    body: { resource: "auth", op: "login", password },
  });
  if (error) {
    const { message } = await readError(error);
    throw new Error(message || "Mot de passe incorrect.");
  }
  if (!data?.token) throw new Error("Réponse d'authentification invalide.");
  setToken(data.token);
}
