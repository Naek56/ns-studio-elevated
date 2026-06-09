import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-border/70 bg-background/70 backdrop-blur-md" : "border-b border-transparent"
      )}
    >
      <div className="container-tight flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5">
            <span
              className="font-display text-[0.7rem] font-extrabold tracking-tight text-orange"
              style={{ textShadow: "0 0 14px hsl(24 95% 54% / 0.8)" }}
            >
              NS.I
            </span>
          </span>
          <span className="font-display text-base font-bold tracking-tight">NS Intelligence</span>
        </a>
        <button onClick={() => go("plans")} className="btn-liquid h-10 px-5 py-0 text-sm">
          Commencer
        </button>
      </div>
    </header>
  );
}
