import { cn } from "@/lib/utils";

export default function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <a href="#home" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="NS Intelligence — accueil">
      <span className="relative grid h-9 w-9 place-items-center rounded-[0.6rem] bg-gradient-primary shadow-glow-sm">
        <span className="font-display text-[0.7rem] font-extrabold leading-none tracking-tight text-primary-foreground">
          NS<span className="opacity-70">.I</span>
        </span>
        <span className="absolute inset-0 rounded-[0.6rem] ring-1 ring-inset ring-white/30" />
      </span>
      {!compact && (
        <span className="font-display text-base font-semibold tracking-tight text-foreground">
          NS&nbsp;<span className="text-muted-foreground font-normal">Intelligence</span>
        </span>
      )}
    </a>
  );
}
