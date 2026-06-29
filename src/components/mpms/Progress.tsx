import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  tone = "primary",
  size = "md",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "success" | "warning" | "destructive" | "cool";
  size?: "sm" | "md" | "lg";
}) {
  const h = size === "sm" ? "h-1" : size === "lg" ? "h-2.5" : "h-1.5";
  const bg =
    tone === "success" ? "bg-success"
    : tone === "warning" ? "bg-warning"
    : tone === "destructive" ? "bg-destructive"
    : tone === "cool" ? "gradient-cool"
    : "gradient-primary";
  return (
    <div className={cn("w-full bg-muted rounded-full overflow-hidden", h, className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700", bg)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function ProgressRing({ value, size = 56, stroke = 5 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--muted)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringgrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="ringgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent-purple)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold">{value}%</div>
    </div>
  );
}