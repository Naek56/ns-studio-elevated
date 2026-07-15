/* Tracker Kairos → Supabase (invisible, sur toutes les pages).
   Écrit chaque événement dans la table `kairos_events` :
     - pageview : { duration_ms }           (URL dans la colonne `page`)
     - click    : { element, text, x, y }
     - scroll   : { depth }                 (profondeur en %)
   Ne démarre QUE si l'utilisateur a accepté les cookies (appelé depuis
   startKairosTracking(), lui-même gardé par le consentement).

   Schéma attendu de la table (à créer côté Supabase) :
     create table kairos_events (
       id          bigint generated always as identity primary key,
       created_at  timestamptz default now(),
       client_id   text,
       session_id  text,
       event_type  text,
       page        text,
       data        jsonb
     );
   + une policy INSERT pour le rôle anon (voir la PR). */

const SUPABASE_URL = "https://kghtuwgzsvxuuqsncvuy.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnaHR1d2d6c3Z4dXVxc25jdnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3OTkyNTcsImV4cCI6MjA5NjM3NTI1N30.LOX747MrQZ-Jimz3uXRDB49Qh3Ik7UQbIbTCQ9GhSp4";
const CLIENT_ID = "way-agency-test";
const ENDPOINT = `${SUPABASE_URL}/rest/v1/kairos_events`;

let started = false;
let sessionId = "";
let currentPage = "";
let pageStart = 0;
let pageLogged = false;
let maxDepthBucket = -1;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function path() {
  return location.pathname + location.search;
}

type Row = { client_id: string; session_id: string; event_type: string; page: string; data: Record<string, unknown> };

function insert(row: Row) {
  try {
    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      keepalive: true,
      mode: "cors",
    }).catch(() => {});
  } catch {
    /* silencieux : le tracking ne doit jamais casser le site */
  }
}

function track(event_type: string, data: Record<string, unknown>) {
  insert({ client_id: CLIENT_ID, session_id: sessionId, event_type, page: currentPage, data });
}

/* ── pageview + durée ─────────────────────────────────────────────── */
function flushPageview() {
  if (pageLogged) return;
  pageLogged = true;
  track("pageview", { duration_ms: Date.now() - pageStart });
}

function beginPage() {
  currentPage = path();
  pageStart = Date.now();
  pageLogged = false;
  maxDepthBucket = -1;
}

/* ── clics ────────────────────────────────────────────────────────── */
function selector(el: Element | null): string {
  if (!el || el.nodeType !== 1) return "inconnu";
  const tag = el.tagName.toLowerCase();
  if (el.id) return `${tag}#${el.id}`;
  const cls = typeof el.className === "string" && el.className.trim()
    ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
    : "";
  return tag + cls;
}
function label(el: Element): string {
  const t = ((el as HTMLElement).innerText || (el as HTMLInputElement).value || el.getAttribute?.("aria-label") || "").trim();
  return t.slice(0, 60);
}
function onClick(e: MouseEvent) {
  const el = e.target as Element;
  track("click", { element: selector(el), text: label(el), x: e.clientX, y: e.clientY });
}

/* ── scroll (profondeur %) ────────────────────────────────────────── */
function depth() {
  const h = document.documentElement, b = document.body;
  const sh = Math.max(h.scrollHeight, b.scrollHeight) - window.innerHeight;
  if (sh <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / sh) * 100));
}
let scrollScheduled = false;
function onScroll() {
  if (scrollScheduled) return;
  scrollScheduled = true;
  window.setTimeout(() => {
    scrollScheduled = false;
    const d = depth();
    const bucket = Math.floor(d / 10) * 10; // paliers de 10 %
    if (bucket > maxDepthBucket) {
      maxDepthBucket = bucket;
      track("scroll", { depth: d });
    }
  }, 350);
}

/** Démarre le tracking Supabase (idempotent). Appelé une fois le
    consentement « accepté » confirmé. */
export function startSupabaseTracking() {
  if (started || typeof window === "undefined") return;
  started = true;

  try {
    sessionId = sessionStorage.getItem("kairos_sb_sid") || uid();
    sessionStorage.setItem("kairos_sb_sid", sessionId);
  } catch {
    sessionId = uid();
  }

  beginPage();

  // navigations SPA : on patche history pour émettre un événement
  const emitNav = () => window.dispatchEvent(new Event("kairos:locationchange"));
  const wrap = (name: "pushState" | "replaceState") => {
    const orig = history[name];
    history[name] = function (this: History, ...args: Parameters<History["pushState"]>) {
      const r = orig.apply(this, args);
      emitNav();
      return r;
    } as History[typeof name];
  };
  wrap("pushState");
  wrap("replaceState");
  window.addEventListener("popstate", emitNav);
  window.addEventListener("kairos:locationchange", () => {
    if (path() === currentPage) return;
    flushPageview();  // clôt la page quittée (avec sa durée)
    beginPage();      // démarre la nouvelle
  });

  document.addEventListener("click", onClick, true);
  window.addEventListener("scroll", onScroll, { passive: true });

  // clôture de la pageview quand on quitte l'onglet / le site
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushPageview(); });
  window.addEventListener("pagehide", flushPageview);
}
