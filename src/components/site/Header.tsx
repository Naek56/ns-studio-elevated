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
        scrolled ? "border-b border-border/70 bg-background/80 backdrop-blur-md" : "border-b border-transparent"
      )}
    >
      <div className="container-tight flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
          Kairos
        </a>
        <button onClick={() => go("plans")} className="btn-primary h-10 px-5 py-0">
          Commencer
        </button>
      </div>
    </header>
  );
}
