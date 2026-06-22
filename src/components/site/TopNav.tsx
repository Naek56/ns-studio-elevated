import { useEffect, useState } from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

// Light sections (white background) over which the nav must turn dark.
const LIGHT_IDS = ["approche"];

export default function TopNav() {
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const probe = 40; // y just under the top edge where the nav sits
      let light = false;
      for (const id of LIGHT_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) light = true;
      }
      setOnLight(light);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: string) => void } }).lenis;
    if (lenis) lenis.scrollTo("#" + id);
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-6 pt-6 transition-colors duration-500 sm:px-10 sm:pt-8",
        onLight ? "text-black" : "text-white"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        <Logo />
        <button
          onClick={() => go("contact")}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-all duration-300 active:scale-[0.98]",
            onLight
              ? "bg-black text-white hover:bg-black/85"
              : "btn-glass"
          )}
        >
          Contact
        </button>
      </div>
    </header>
  );
}
