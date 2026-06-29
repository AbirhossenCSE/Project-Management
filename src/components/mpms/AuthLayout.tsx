import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background font-sans">
      {/* Form side */}
      <div className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg gradient-primary grid place-items-center shadow-glow">
            <div className="size-3.5 rounded-sm bg-white/30 border-2 border-white/70" />
          </div>
          <span className="font-semibold tracking-tight">Nexus.io</span>
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto py-12">
            <h1 className="text-2xl font-semibold tracking-tight mb-1">{title}</h1>
            <p className="text-sm text-muted-foreground mb-8">{subtitle}</p>
            <div className="animate-fade-up">{children}</div>
            {footer && <div className="mt-6 text-center text-xs text-muted-foreground">{footer}</div>}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>© 2026 Nexus.io</span>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-foreground">Privacy</Link>
            <Link to="/login" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>

      {/* Visual side */}
      <div className="hidden lg:flex relative overflow-hidden bg-primary-soft items-center justify-center p-12">
        <div className="absolute inset-0 opacity-40" style={{
          background: "radial-gradient(800px 400px at 30% 20%, oklch(0.7 0.2 268 / 0.4), transparent), radial-gradient(600px 500px at 80% 80%, oklch(0.74 0.13 215 / 0.35), transparent)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.4,
        }} />

        <div className="relative max-w-md space-y-6">
          <div className="bg-card/80 glass rounded-2xl p-5 border border-border shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold">Sprint 14 — Realtime Pipes</span>
              <span className="text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">On Track</span>
            </div>
            <div className="space-y-2 mb-3">
              {[
                { name: "Refactor middleware", done: 72 },
                { name: "WS notification gateway", done: 48 },
                { name: "Audit log retention", done: 91 },
              ].map((t) => (
                <div key={t.name} className="flex items-center gap-3">
                  <div className="flex-1 text-xs">{t.name}</div>
                  <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-primary rounded-full" style={{ width: `${t.done}%` }} />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground w-8 text-right">{t.done}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/80 glass rounded-xl p-4 border border-border shadow-soft">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Velocity</div>
              <div className="text-xl font-semibold font-mono mt-1">42.8 <span className="text-xs text-muted-foreground">pts</span></div>
              <div className="mt-3 flex items-end gap-0.5 h-8">
                {[40, 65, 50, 80, 70, 90, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/30 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-card/80 glass rounded-xl p-4 border border-border shadow-soft">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Team</div>
              <div className="text-xl font-semibold font-mono mt-1">14 active</div>
              <div className="mt-3 flex -space-x-2">
                {["oklch(0.52 0.22 268)", "oklch(0.74 0.13 215)", "oklch(0.62 0.2 295)", "oklch(0.68 0.16 155)"].map((c, i) => (
                  <div key={i} className="size-6 rounded-full ring-2 ring-card" style={{ background: c }} />
                ))}
                <div className="size-6 rounded-full bg-muted ring-2 ring-card text-[9px] font-semibold grid place-items-center text-muted-foreground">+9</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-balance">"We replaced three tools with Nexus and shipped 2× faster."</p>
            <p className="text-xs text-muted-foreground mt-1">Mira Patel · Head of Engineering, Atlas Corp</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthInput({
  label, type = "text", placeholder, right,
}: { label: string; type?: string; placeholder?: string; right?: ReactNode }) {
  return (
    <label className="block mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {right}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 rounded-md px-3 py-2 text-sm outline-none transition-all"
      />
    </label>
  );
}

export function AuthButton({ children, variant = "primary" }: { children: ReactNode; variant?: "primary" | "outline" }) {
  if (variant === "outline") {
    return (
      <button className="w-full border border-border bg-card hover:bg-muted py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors">
        {children}
      </button>
    );
  }
  return (
    <button className="w-full gradient-primary text-white py-2 rounded-md text-sm font-semibold hover:opacity-95 shadow-glow transition-all">
      {children}
    </button>
  );
}