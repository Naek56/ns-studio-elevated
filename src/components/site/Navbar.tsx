import logo from "@/assets/logo-ns-studio.png";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3 bg-background/70 backdrop-blur-xl border-b border-border/50" : "py-5 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <img src={logo} alt="NS Studio" className="h-9 w-auto rounded-md" />
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <button onClick={() => scrollTo("services")} className="hover:text-foreground transition-colors">Services</button>
          <button onClick={() => scrollTo("process")} className="hover:text-foreground transition-colors">Process</button>
          <button onClick={() => scrollTo("pricing")} className="hover:text-foreground transition-colors">Tarifs</button>
          <button onClick={() => scrollTo("faq")} className="hover:text-foreground transition-colors">FAQ</button>
        </nav>
        <Button variant="hero" size="sm" onClick={() => scrollTo("booking")}>
          Réserver
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
