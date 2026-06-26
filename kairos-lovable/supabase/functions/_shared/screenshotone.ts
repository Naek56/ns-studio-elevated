export type Screenshot = {
  url: string;
  media_type: "image/jpeg";
  data: string; // base64
};

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

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function takeScreenshot(url: string): Promise<Screenshot | null> {
  const accessKey = Deno.env.get("SCREENSHOTONE_API_KEY");
  if (!accessKey) return null;
  const normalized = normalizeUrl(url);
  if (!normalized) return null;

  const params = new URLSearchParams({
    access_key: accessKey,
    url: normalized,
    format: "jpg",
    image_quality: "72",
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
    const res = await fetch(`https://api.screenshotone.com/take?${params.toString()}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0) return null;
    return { url: normalized, media_type: "image/jpeg", data: toBase64(buffer) };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function takeScreenshots(urls: string[]): Promise<Screenshot[]> {
  const unique = Array.from(new Set(urls.map(normalizeUrl).filter(Boolean) as string[]));
  const results = await Promise.all(unique.map((u) => takeScreenshot(u)));
  return results.filter((s): s is Screenshot => s !== null);
}
