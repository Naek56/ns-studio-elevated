/**
 * Authentification par mot de passe maître.
 * Cookie de session signé (HMAC-SHA256) valable 24h.
 * Compatible Edge runtime (Web Crypto) — utilisable dans middleware ET route handlers.
 */

export const SESSION_COOKIE = "kairos_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 heures (en secondes)

const encoder = new TextEncoder();

function secret(): string {
  return process.env.KAIROS_PASSWORD || "kairos-dev-secret-change-me";
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(sig);
}

/** Crée un token de session signé qui expire dans 24h. */
export async function createSessionToken(): Promise<string> {
  const expiry = String(Date.now() + SESSION_MAX_AGE * 1000);
  const signature = await sign(expiry);
  return `${expiry}.${signature}`;
}

/** Vérifie la validité et la non-expiration d'un token de session. */
export async function verifySessionToken(
  token: string | null | undefined
): Promise<boolean> {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;

  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) return false;

  const expected = await sign(expiry);
  // Comparaison à temps constant
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}
