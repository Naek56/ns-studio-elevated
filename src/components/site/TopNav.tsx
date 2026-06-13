import { useEffect, useState } from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { label: "Accueil", id: "accueil" },
  { label: "Studio", id: "studio" },
  { label: "Kairos", id: "kairos" },
  { label: "Vision", id: "vision" },
];

export default function TopNav() {
  const [active, setActive] = useState("accueil");

  useEffect(() => {
    const ids = [...links.map((l) => l.id), "contact"];
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let cur = "accueil";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) cur = id;
      }
      setActive(cur);
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
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="container-tight flex items-center justify-between gap-3">
        <Logo />

        <nav className="liquid-glass hidden items-center gap-0.5 rounded-full p-1.5 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                active === l.id ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
              )}
            >
              {active === l.id && <span className="absolute inset-0 rounded-full bg-primary" />}
              <span className="relative">{l.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => go("contact")} className="btn-glass">
          Contact
        </button>
      </div>
    </header>
  );
}
