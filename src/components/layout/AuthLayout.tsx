import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Shield, Zap, BarChart3 } from "lucide-react";

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
          <svg className="size-8 text-primary shadow-glow rounded-lg animate-fade-up" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#logo-grad-auth)" />
            <path d="M10 16.5L14 20.5L22 11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="logo-grad-auth" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="oklch(0.62 0.2 295)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-semibold tracking-tight">Nexus.io</span>
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto py-12">
            {title && <h1 className="text-2xl font-semibold tracking-tight mb-1">{title}</h1>}
            {subtitle && <p className="text-sm text-muted-foreground mb-8">{subtitle}</p>}
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

        <div className="relative max-w-md space-y-6 w-full animate-fade-up">
          <div className="space-y-4">
            <div className="bg-card/85 glass rounded-2xl p-5 border border-border/80 shadow-elevated hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Shield className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Role-based dashboards</h3>
                <p className="text-xs text-muted-foreground mt-1">Tailored workspaces for admins, project leads, and developers with fine-grained access controls.</p>
              </div>
            </div>

            <div className="bg-card/85 glass rounded-2xl p-5 border border-border/80 shadow-elevated hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-accent-cyan/15 text-accent-cyan shrink-0">
                <Zap className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Real-time task tracking</h3>
                <p className="text-xs text-muted-foreground mt-1">Interactive Kanban boards, status trackers, and automatic activity logs for instant visibility.</p>
              </div>
            </div>

            <div className="bg-card/85 glass rounded-2xl p-5 border border-border/80 shadow-elevated hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-accent-purple/15 text-accent-purple shrink-0">
                <BarChart3 className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Sprint planning & analytics</h3>
                <p className="text-xs text-muted-foreground mt-1">Track velocity, calculate team metrics, and plan roadmap milestones with live charts.</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm font-medium text-balance">"We replaced three tools with Nexus and shipped 2× faster."</p>
            <p className="text-xs text-muted-foreground mt-1">Mira Patel · Head of Engineering, Atlas Corp</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthInput({
  label, type = "text", placeholder, right, className, ...props
}: { label: string; type?: string; placeholder?: string; right?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="block mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {right}
      </div>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          className={`w-full bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 rounded-md px-3 py-2 text-sm outline-none transition-all disabled:cursor-not-allowed disabled:opacity-60 pr-10 ${className ?? ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </label>
  );
}

export function AuthButton({
  children,
  variant = "primary",
  className,
  ...props
}: { children: ReactNode; variant?: "primary" | "outline" } & ButtonHTMLAttributes<HTMLButtonElement>) {
  if (variant === "outline") {
    return (
      <button
        className={`w-full border border-border bg-card hover:bg-muted py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      className={`w-full gradient-primary text-white py-2 rounded-md text-sm font-semibold hover:opacity-95 shadow-glow transition-all disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}