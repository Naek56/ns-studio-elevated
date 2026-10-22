import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  score: number | null;
  previous?: number | null;
};

function scoreColor(score: number): string {
  if (score >= 75) return "#3FB950";
  if (score >= 50) return "#FF6B2B";
  return "#F05D5D";
}

export default function HealthScore({ score, previous }: Props) {
  const value = score ?? 0;
  const color = scoreColor(value);
  const delta = score != null && previous != null ? score - previous : null;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-6 rounded-lg border border-kairos-border bg-kairos-panel p-6">
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#262626" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={score == null ? circumference : offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl font-light leading-none text-white">
            {score == null ? "—" : value}
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-kairos-muted">
            / 100
          </span>
        </div>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-kairos-muted">
          Score de santé
        </p>
        <p className="mt-1 font-display text-2xl text-white">
          {value >= 75 ? "Solide" : value >= 50 ? "À surveiller" : "Fragile"}
        </p>
        {delta != null ? (
          <div
            className={cn(
              "mt-2 flex items-center gap-1.5 font-mono text-sm",
              delta > 0
                ? "text-kairos-green"
                : delta < 0
                  ? "text-kairos-red"
                  : "text-kairos-muted"
            )}
          >
            {delta > 0 ? <TrendingUp size={15} /> : delta < 0 ? <TrendingDown size={15} /> : <Minus size={15} />}
            {delta > 0 ? "+" : ""}
            {delta} pts vs mois précédent
          </div>
        ) : (
          <p className="mt-2 font-mono text-xs text-kairos-muted">
            Progression disponible dès le 2ᵉ rapport.
          </p>
        )}
      </div>
    </div>
  );
}
