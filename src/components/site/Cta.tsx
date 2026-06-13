import { ArrowRight } from "lucide-react";

export default function Cta({ label = "Démarrer un projet", className = "" }: { label?: string; className?: string }) {
  const go = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: string) => void } }).lenis;
    if (lenis) lenis.scrollTo("#contact");
    else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button onClick={go} className={`btn-glass group mt-9 ${className}`}>
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
