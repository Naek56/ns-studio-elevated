import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Accueil", id: "accueil" },
  { label: "Studio", id: "studio" },
  { label: "Kairos", id: "kairos" },
  { label: "Vision", id: "vision" },
  { label: "Contact", id: "contact" },
];

export default function BottomNav() {
  const [active, setActive] = useState("accueil");

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let current = links[0].id;
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.offsetTop <= mid) current = l.id;
      }
      setActive(current);
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
    <nav
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass-mono flex items-center gap-0.5 rounded-full p-1.5 sm:gap-1">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => go(l.id)}
            className={cn(
              "relative rounded-full px-3 py-2.5 text-xs font-medium transition-colors duration-300 sm:px-4 sm:text-sm",
              active === l.id ? "text-background" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active === l.id && (
              <span className="absolute inset-0 rounded-full bg-white" />
            )}
            <span className="relative">{l.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
