import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, User, Trello, Zap, BarChart3, ShieldCheck, RefreshCw, UserPlus } from "lucide-react";

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
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <header className="px-6 sm:px-10 py-4 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <svg className="size-8 text-primary shadow-glow rounded-lg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#logo-grad-index)" />
            <path d="M10 16.5L14 20.5L22 11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="logo-grad-index" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="oklch(0.62 0.2 295)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-semibold tracking-tight">Nexus.io</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4 text-xs">
          <Link to="/login" className="text-muted-foreground hover:text-foreground font-semibold transition-colors">Sign in</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg gradient-primary text-white font-bold shadow-glow hover:opacity-95 transition-all">Get Started</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="px-6 py-20 sm:py-28 text-center max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary border border-primary/20 mb-8 animate-fade-up">
            Project Management Suite
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] max-w-3xl mx-auto animate-fade-up">
            Ship faster with <br className="hidden sm:inline" />
            your team <br className="hidden sm:inline" />
            <span className="text-gradient">in sync.</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-up">
            Collaborate on tasks, plan active sprints, track developer velocity, and analyze workload metrics — all from a single beautiful workspace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto animate-fade-up">
            <Link to="/register" className="px-5 py-3 rounded-lg gradient-primary text-white text-xs font-bold shadow-glow hover:opacity-95 transition-all w-full sm:w-auto text-center cursor-pointer">
              Get started free
            </Link>
            <Link to="/login" className="px-5 py-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all w-full sm:w-auto text-center cursor-pointer">
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground animate-fade-up">
            Free to use · No credit card required
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 border-t border-border bg-muted/20 w-full">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Everything you need to deliver</h2>
              <p className="text-xs text-muted-foreground mt-2">Ditch spreadsheets and disjointed tools for a single, unified source of truth.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Trello, title: "Kanban Board", desc: "Interactive drag & drop task tracking board" },
                { icon: Zap, title: "Sprint Planning", desc: "Organize sprint parameters and track tasks" },
                { icon: BarChart3, title: "Team Analytics", desc: "Live velocity tracking and member rankings" },
                { icon: ShieldCheck, title: "Role-based Access", desc: "Dedicated workspaces for members and administrators" },
                { icon: RefreshCw, title: "Real-time Updates", desc: "Continuous live state synchronization with the DB" },
                { icon: UserPlus, title: "Task Assignment", desc: "Seamless task assignments and updates" },
              ].map((f, i) => (
                <div key={i} className="bg-card border border-border/80 rounded-2xl p-6 shadow-soft hover:-translate-y-1 transition-all duration-300">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workspaces Selector Section */}
        <section className="py-20 max-w-4xl mx-auto px-6 w-full">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Choose your workspace</h2>
            <p className="text-xs text-muted-foreground mt-2">Step into tailored viewports customized for your workspace function.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Link to="/admin" className="group bg-card border border-border rounded-2xl p-8 text-left shadow-soft hover:shadow-elevated hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="size-12 rounded-xl gradient-primary grid place-items-center shadow-glow mb-6">
                <Shield className="size-6 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">Admin Console</span>
                <ArrowRight className="size-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">Full organization view: review visual dashboards, adjust member profiles, track reports, and manage settings.</p>
            </Link>
            
            <Link to="/app" className="group bg-card border border-border rounded-2xl p-8 text-left shadow-soft hover:shadow-elevated hover:border-accent-cyan/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="size-12 rounded-xl grid place-items-center mb-6" style={{ background: "linear-gradient(135deg, var(--accent-cyan), var(--primary))" }}>
                <User className="size-6 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">Member Workspace</span>
                <ArrowRight className="size-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-accent-cyan transition-all" />
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">Personal task dashboard: drag tasks on the kanban board, log sprint objectives, browse the calendar, and review actions.</p>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card mt-auto w-full">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 Nexus.io. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
