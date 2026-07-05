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
  if (value === "accepted") {
    startKairosTracking();
  } else {
    // revocation: clear the tracker's own consent key so it stays silent
    // from the next page load on (the script only reads, never re-sets it)
    try { localStorage.removeItem("kairos_consent"); } catch { /* noop */ }
    (window as KairosWindow).__kairosConsent = false;
  }
}

type KairosWindow = Window & { kairosGrantConsent?: () => void; __kairosConsent?: boolean };

let tracking = false;
/** Kairos analytics (public/kairos-tracker.js) only ever start with an explicit "accepted" consent. */
export function startKairosTracking() {
  if (tracking || getConsent() !== "accepted") return;
  tracking = true;
  const w = window as KairosWindow;
  if (typeof w.kairosGrantConsent === "function") {
    // grants the tracker's consent flag and starts collection immediately
    w.kairosGrantConsent();
  } else {
    // tracker not parsed yet (defer): raise the flags it polls/listens for
    w.__kairosConsent = true;
    try { localStorage.setItem("kairos_consent", "granted"); } catch { /* noop */ }
    document.dispatchEvent(new Event("kairos:consent"));
  }
}

export function openCookieBanner() {
  window.dispatchEvent(new Event("way:openCookies"));
}
