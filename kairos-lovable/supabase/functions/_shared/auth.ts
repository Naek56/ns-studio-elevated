// Auth par mot de passe maître — token HMAC-SHA256 valable 24h.
// Symétrique de la version Next.js, porté sur Deno (Web Crypto).

const SESSION_MAX_AGE = 60 * 60 * 24; // 24h en secondes
const encoder = new TextEncoder();

function secret(): string {
  return Deno.env.get("KAIROS_PASSWORD") || "kairos-dev-secret-change-me";
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

export async function createToken(): Promise<string> {
  const expiry = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expiry}.${await sign(expiry)}`;
}

export async function verifyToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) return false;

  const expected = await sign(expiry);
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Vérifie le header x-kairos-token de la requête. */
export async function requireToken(req: Request): Promise<boolean> {
  return verifyToken(req.headers.get("x-kairos-token"));
}
