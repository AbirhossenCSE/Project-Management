import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  icon: Icon,
  footer,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down";
  icon?: LucideIcon;
  footer?: ReactNode;
  accent?: "primary" | "cyan" | "purple" | "success" | "warning";
}) {
  const accentBg = {
    primary: "bg-primary/10 text-primary",
    cyan: "bg-accent-cyan/15 text-accent-cyan",
    purple: "bg-accent-purple/10 text-accent-purple",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
  }[accent];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={cn("size-8 rounded-lg grid place-items-center transition-transform group-hover:scale-110", accentBg)}>
            <Icon className="size-4" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-semibold tracking-tight font-mono">{value}</span>
        {delta && (
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-0.5",
              trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {trend === "up" ? <ArrowUp className="size-2.5" /> : <ArrowDown className="size-2.5" />}
            {delta}
          </span>
        )}
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}