import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { label: "Accueil", id: "accueil" },
  { label: "Studio", id: "studio" },
  { label: "Kairos", id: "kairos" },
  { label: "Vision", id: "vision" },
];

export default function TopNav({ show }: { show: boolean }) {
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
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: show ? 0 : -70, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="fixed inset-x-0 top-0 z-50 px-6 pt-6"
    >
      <div className="container-wide flex items-center justify-between gap-6">
        <Logo />

        <nav className="liquid-glass hidden items-center gap-2 rounded-full px-3 py-2 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={cn(
                "relative rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-colors duration-300",
                active === l.id ? "text-primary-foreground" : "text-foreground/60 hover:text-foreground"
              )}
            >
              {active === l.id && <span className="absolute inset-0 rounded-full bg-primary" />}
              <span className="relative">{l.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => go("contact")} className="btn-glass px-7 py-3">
          Contact
        </button>
      </div>
    </motion.header>
  );
}
