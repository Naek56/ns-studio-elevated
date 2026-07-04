const KEY = "way-cookie-consent";
const TWELVE_MONTHS = 365 * 24 * 60 * 60 * 1000;

export type ConsentValue = "accepted" | "refused";

export function getConsent(): ConsentValue | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { value, date } = JSON.parse(raw) as { value: ConsentValue; date: string };
    // a choice older than 12 months expires: the banner shows again
    if (Date.now() - new Date(date).getTime() > TWELVE_MONTHS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return value === "accepted" || value === "refused" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ value, date: new Date().toISOString() }));
  } catch {
    /* storage unavailable — the banner will simply show again */
  }
  if (value === "accepted") startKairosTracking();
}

let tracking = false;
/** Kairos analytics only ever start with an explicit "accepted" consent. */
export function startKairosTracking() {
  if (tracking || getConsent() !== "accepted") return;
  tracking = true;
  // Kairos tracking bootstrap goes here (clicks, scrolls, pages, durée de visite).
}

export function openCookieBanner() {
  window.dispatchEvent(new Event("way:openCookies"));
}
