import { cn } from "@/lib/utils";

export default function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <a href="#accueil" className={cn("flex items-center gap-3", className)} aria-label="WAY Agency">
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className="font-display text-lg font-extrabold tracking-tight leading-none">
          WAY
          <span className="block text-[0.55rem] font-medium tracking-[0.3em] text-muted-foreground">
            CREATIVE AGENCY
          </span>
        </span>
      )}
    </a>
  );
}
