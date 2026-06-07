import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { LiquidButton } from "@/components/ui/liquid-button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Approche", id: "approche" },
  { label: "Services", id: "services" },
  { label: "Intelligence", id: "intelligence" },
  { label: "Réalisations", id: "realisations" },
  { label: "Process", id: "process" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // Only reveal the nav once the visitor has stepped through the door
      const home = document.getElementById("home");
      const top = home ? home.getBoundingClientRect().top : Infinity;
      setVisible(top <= window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-5xl items-center justify-between rounded-full px-3 py-2 transition-all duration-300",
          scrolled ? "liquid-glass" : "border border-transparent"
        )}
      >
        <div className="pl-2">
          <Logo />
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <LiquidButton size="sm" onClick={() => go("contact")}>
            Démarrer un projet
          </LiquidButton>
        </div>

        <button
          className="rounded-full p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 w-[calc(100%-2rem)] max-w-5xl rounded-3xl liquid-glass p-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-xl px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </button>
            ))}
            <LiquidButton className="mt-2 w-full" onClick={() => go("contact")}>
              Démarrer un projet
            </LiquidButton>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
