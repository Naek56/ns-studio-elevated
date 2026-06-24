import { useEffect, useState } from "react";

const STORAGE_KEY = "ns_cookie_consent";
const POSTHOG_KEY = "phc_n63k68aZGXDvkMCr3XM53Y67ZfxUTVjYqiXhKHn7xPV8";
const POSTHOG_HOST = "https://eu.i.posthog.com";

function loadPostHog() {
  if (typeof window === "undefined" || (window as any).posthog?.__loaded) return;
  // Official PostHog snippet (array-stub loader)
  !(function (t: any, e: any) {
    var o, n, p, r;
    e.__SV ||
      ((window as any).posthog = e),
      (e._i = []),
      (e.init = function (i: any, s: any, a: any) {
        function g(t: any, e: any) {
          var o = e.split(".");
          2 == o.length && ((t = t[o[0]]), (e = o[1]));
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        }
        (p = t.createElement("script")).type = "text/javascript";
        p.crossOrigin = "anonymous";
        p.async = !0;
        p.src =
          s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
          "/static/array.js";
        (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
        var u = e;
        for (
          void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
            u.people = u.people || [],
            u.toString = function (t: any) {
              var e = "posthog";
              return (
                "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e
              );
            },
            u.people.toString = function () {
              return u.toString(1) + ".people (stub)";
            },
            o =
              "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(
                " "
              ),
            n = 0;
          n < o.length;
          n++
        )
          g(u, o[n]);
        e._i.push([i, s, a]);
      }),
      (e.__SV = 1);
  })(document, (window as any).posthog || []);

  (window as any).posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem(STORAGE_KEY);
    if (choice === "accepted") {
      loadPostHog();
    } else if (!choice) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    loadPostHog();
  };

  const refuse = () => {
    localStorage.setItem(STORAGE_KEY, "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-black/85 p-4 text-white shadow-2xl backdrop-blur-xl sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-white/85">
          Ce site utilise des cookies analytiques pour améliorer votre expérience.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={refuse}
            className="rounded-full border border-white/25 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
