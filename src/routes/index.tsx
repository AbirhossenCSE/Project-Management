import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LayoutDashboard, Shield, User } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus.io — Minimal Project Management" },
      { name: "description", content: "A premium minimal project management system for modern teams." },
    ],
  }),
  component: Entry,
});

function Entry() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="px-6 sm:px-10 py-5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg gradient-primary grid place-items-center shadow-glow">
            <div className="size-3.5 rounded-sm bg-white/30 border-2 border-white/70" />
          </div>
          <span className="font-semibold tracking-tight">Nexus.io</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/login" className="text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link to="/register" className="px-3 py-1.5 rounded-md gradient-primary text-white text-xs font-medium shadow-glow">Get started</Link>
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-6 py-16">
        <div className="max-w-4xl w-full text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Demo · MPMS v1.0
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-balance">
            The <span className="text-gradient">minimal</span> project management system.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-pretty">
            Projects, sprints, tasks, teams, and reporting — designed with the calm of Linear, the depth of Jira, and the polish of Notion.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link to="/admin" className="group bg-card border border-border rounded-2xl p-6 text-left shadow-soft hover:shadow-elevated hover:border-primary/40 hover:-translate-y-0.5 transition-all">
              <div className="size-10 rounded-lg gradient-primary grid place-items-center shadow-glow mb-4">
                <Shield className="size-5 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Admin Console</span>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Full org view — projects, teams, reports, settings.</p>
            </Link>
            <Link to="/app" className="group bg-card border border-border rounded-2xl p-6 text-left shadow-soft hover:shadow-elevated hover:border-accent-cyan/40 hover:-translate-y-0.5 transition-all">
              <div className="size-10 rounded-lg grid place-items-center mb-4" style={{ background: "linear-gradient(135deg, var(--accent-cyan), var(--primary))" }}>
                <User className="size-5 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Member Workspace</span>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-accent-cyan transition-all" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">My tasks, sprints, calendar, activity.</p>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><LayoutDashboard className="size-3.5" /> Kanban + Table</span>
            <span className="inline-flex items-center gap-1.5"><LayoutDashboard className="size-3.5" /> Sprint analytics</span>
            <span className="inline-flex items-center gap-1.5"><LayoutDashboard className="size-3.5" /> Workload heatmaps</span>
            <span className="inline-flex items-center gap-1.5"><LayoutDashboard className="size-3.5" /> Dark mode ready</span>
          </div>
        </div>
      </main>
    </div>
  );
}
