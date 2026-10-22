import type { Screenshot } from "./types";

const ENDPOINT = "https://api.screenshotone.com/take";

/**
 * Prend un screenshot d'une page via l'API Screenshotone et le retourne
 * encodé en base64 (prêt pour l'API vision de Claude).
 * Retourne `null` en cas d'échec (URL injoignable, clé manquante, timeout).
 */
export async function takeScreenshot(url: string): Promise<Screenshot | null> {
  const accessKey = process.env.SCREENSHOTONE_API_KEY;
  if (!accessKey) return null;

  const normalized = normalizeUrl(url);
  if (!normalized) return null;

  const params = new URLSearchParams({
    access_key: accessKey,
    url: normalized,
    format: "jpg",
    image_quality: "78",
    viewport_width: "1280",
    viewport_height: "900",
    full_page: "false",
    block_cookie_banners: "true",
    block_ads: "true",
    block_chats: "true",
    cache: "true",
    cache_ttl: "86400",
    timeout: "30",
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) return null;
    return {
      url: normalized,
      media_type: "image/jpeg",
      data: buffer.toString("base64"),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Prend plusieurs screenshots en parallèle, en filtrant les échecs. */
export async function takeScreenshots(urls: string[]): Promise<Screenshot[]> {
  const unique = Array.from(new Set(urls.map(normalizeUrl).filter(Boolean) as string[]));
  const results = await Promise.all(unique.map((u) => takeScreenshot(u)));
  return results.filter((s): s is Screenshot => s !== null);
}

function normalizeUrl(url: string): string | null {
  if (!url) return null;
  let v = url.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    return new URL(v).toString();
  } catch {
    return null;
  }
}
