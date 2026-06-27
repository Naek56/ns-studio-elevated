import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** True si la requête courante possède une session Kairos valide. */
export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * À appeler en tête de chaque route handler protégé.
 * Retourne une `NextResponse` 401 si non authentifié, sinon `null`.
 */
export async function requireAuth(): Promise<NextResponse | null> {
  if (await isAuthenticated()) return null;
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}
