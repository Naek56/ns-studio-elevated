import type { KairosEvent } from "./types";

export type EventsSummary = {
  periodeJours: number;
  totalEvents: number;
  sessions: number;
  pagesVues: number;
  clics: number;
  rageClicks: number;
  pausesScroll: number;
  dureeSessionMoyenneSec: number;
  tauxRebondEstime: number; // % de sessions à 1 seule page vue
  pages: Array<{
    page: string;
    vues: number;
    dureeMoyenneSec: number;
    profondeurScrollMax: number;
    rageClicks: number;
  }>;
  elementsRageClick: Array<{ element: string; occurrences: number }>;
  elementsCliques: Array<{ element: string; occurrences: number }>;
};

function num(v: unknown, fallback = 0): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Agrège les events bruts en un résumé analytique compact destiné à Claude.
 * Évite d'envoyer des milliers d'events bruts dans le contexte.
 */
export function summarizeEvents(events: KairosEvent[], periodeJours = 7): EventsSummary {
  const sessions = new Set<string>();
  const pageStats = new Map<
    string,
    { vues: number; dureeTotale: number; dureeCount: number; scrollMax: number; rage: number }
  >();
  const rageElements = new Map<string, number>();
  const clickElements = new Map<string, number>();
  const sessionPages = new Map<string, Set<string>>();
  const sessionDurations = new Map<string, number>();

  let clics = 0;
  let rageClicks = 0;
  let pausesScroll = 0;
  let pagesVues = 0;

  const getPage = (p: string) => {
    let s = pageStats.get(p);
    if (!s) {
      s = { vues: 0, dureeTotale: 0, dureeCount: 0, scrollMax: 0, rage: 0 };
      pageStats.set(p, s);
    }
    return s;
  };

  for (const ev of events) {
    const sid = ev.session_id || "unknown";
    sessions.add(sid);
    const page = ev.page || (ev.data?.url as string) || "(inconnu)";
    const data = ev.data || {};

    if (!sessionPages.has(sid)) sessionPages.set(sid, new Set());

    switch (ev.type) {
      case "pageview": {
        pagesVues++;
        const s = getPage(page);
        s.vues++;
        sessionPages.get(sid)!.add(page);
        break;
      }
      case "pageview_end": {
        const s = getPage(page);
        const d = num(data.durationMs) / 1000;
        if (d > 0) {
          s.dureeTotale += d;
          s.dureeCount++;
        }
        const scroll = num(data.maxScroll ?? data.depth);
        if (scroll > s.scrollMax) s.scrollMax = scroll;
        break;
      }
      case "click": {
        clics++;
        const el = String(data.selector || data.element || data.text || "élément").slice(0, 80);
        clickElements.set(el, (clickElements.get(el) || 0) + 1);
        break;
      }
      case "rage_click": {
        rageClicks++;
        const el = String(data.selector || data.element || "élément").slice(0, 80);
        rageElements.set(el, (rageElements.get(el) || 0) + 1);
        getPage(page).rage++;
        break;
      }
      case "scroll": {
        const s = getPage(page);
        const depth = num(data.depth);
        if (depth > s.scrollMax) s.scrollMax = depth;
        break;
      }
      case "scroll_pause": {
        pausesScroll++;
        break;
      }
      case "session_end": {
        const d = num(data.durationMs) / 1000;
        if (d > 0) sessionDurations.set(sid, d);
        const scroll = num(data.maxScroll);
        if (page) {
          const s = getPage(page);
          if (scroll > s.scrollMax) s.scrollMax = scroll;
        }
        break;
      }
      default:
        break;
    }
  }

  const durationValues = Array.from(sessionDurations.values());
  const dureeSessionMoyenneSec =
    durationValues.length > 0
      ? Math.round(durationValues.reduce((a, b) => a + b, 0) / durationValues.length)
      : 0;

  const monoPageSessions = Array.from(sessionPages.values()).filter((s) => s.size <= 1).length;
  const tauxRebondEstime =
    sessions.size > 0 ? Math.round((monoPageSessions / sessions.size) * 100) : 0;

  const pages = Array.from(pageStats.entries())
    .map(([page, s]) => ({
      page,
      vues: s.vues,
      dureeMoyenneSec: s.dureeCount > 0 ? Math.round(s.dureeTotale / s.dureeCount) : 0,
      profondeurScrollMax: Math.round(s.scrollMax),
      rageClicks: s.rage,
    }))
    .sort((a, b) => b.vues - a.vues)
    .slice(0, 12);

  const topMap = (m: Map<string, number>, key: string) =>
    Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([element, occurrences]) => ({ [key]: element, occurrences } as never));

  return {
    periodeJours,
    totalEvents: events.length,
    sessions: sessions.size,
    pagesVues,
    clics,
    rageClicks,
    pausesScroll,
    dureeSessionMoyenneSec,
    tauxRebondEstime,
    pages,
    elementsRageClick: topMap(rageElements, "element"),
    elementsCliques: topMap(clickElements, "element"),
  };
}
