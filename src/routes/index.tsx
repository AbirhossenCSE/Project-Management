import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Shield,
  User,
  FolderKanban,
  Kanban,
  Zap,
  Users,
  BarChart3,
  Lock,
  CheckCircle2,
  Sparkles,
  Github,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus.io — Modern Project & Task Management Suite" },
      {
        name: "description",
        content:
          "Nexus.io brings your team, tasks, and sprints into one clean workspace. Designed for speed, built for teams.",
      },
    ],
  }),
  component: Entry,
});

function Entry() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden scroll-smooth">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 w-full glass border-b border-border/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="size-9 rounded-xl gradient-primary grid place-items-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="size-4 rounded-sm bg-white/30 border-2 border-white/80" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold tracking-tight text-base text-foreground">Nexus.io</span>
              <span className="text-[10px] text-muted-foreground font-medium">Workspace Suite</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors cursor-pointer">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors cursor-pointer">
              How it works
            </a>
            <a href="#demo" className="hover:text-primary transition-colors cursor-pointer">
              Demo
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/login"
              className="px-3.5 py-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg gradient-primary text-white font-bold shadow-glow hover:opacity-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* 2. HERO SECTION */}
        <section className="relative px-4 sm:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 max-w-5xl mx-auto w-full text-center">
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[350px] sm:size-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none -z-10" />

          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-soft mb-8 animate-fade-up">
            <Sparkles className="size-3.5 text-primary" />
            <span>✦ Now in Beta · Free to use</span>
          </div>

          {/* Large Headline (3 lines) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] animate-fade-up">
            Manage projects. <br />
            Track tasks. <br />
            <span className="text-gradient">Ship faster.</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up">
            Nexus.io brings your team, tasks, and sprints into one clean workspace. Designed for speed, built for teams.
          </p>

          {/* Two CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto animate-fade-up">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl gradient-primary text-white text-sm font-bold shadow-glow hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Start for free</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground text-sm font-semibold hover:border-primary/40 transition-all duration-200 cursor-pointer text-center"
            >
              View demo
            </Link>
          </div>

          {/* Social Proof & Avatars */}
          <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
            <div className="flex items-center -space-x-2">
              <div className="size-9 rounded-full ring-2 ring-background gradient-primary grid place-items-center text-white text-xs font-bold shadow-soft">
                JD
              </div>
              <div className="size-9 rounded-full ring-2 ring-background bg-gradient-to-br from-cyan-500 to-blue-600 grid place-items-center text-white text-xs font-bold shadow-soft">
                AS
              </div>
              <div className="size-9 rounded-full ring-2 ring-background bg-gradient-to-br from-purple-500 to-pink-600 grid place-items-center text-white text-xs font-bold shadow-soft">
                MK
              </div>
            </div>
            <div className="flex flex-col sm:items-start text-center sm:text-left text-xs">
              <span className="font-semibold text-foreground">Join 500+ users</span>
              <span className="text-muted-foreground text-[11px]">Trusted by developers and teams worldwide</span>
            </div>
          </div>
        </section>

        {/* 3. FEATURES SECTION */}
        <section id="features" className="py-24 border-t border-border bg-muted/20 w-full scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Everything your team needs
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
                Powerful features to help you manage projects efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: FolderKanban,
                  title: "Project Management",
                  desc: "Create, organize, and track all your projects",
                  color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
                },
                {
                  icon: Kanban,
                  title: "Task Kanban Board",
                  desc: "Drag & drop tasks across status columns",
                  color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
                },
                {
                  icon: Zap,
                  title: "Sprint Planning",
                  desc: "Plan sprints and track velocity",
                  color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  desc: "Assign tasks and manage member roles",
                  color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                },
                {
                  icon: BarChart3,
                  title: "Reports & Analytics",
                  desc: "Get insights into team performance",
                  color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
                },
                {
                  icon: Lock,
                  title: "Role-based Access",
                  desc: "Admin and Member dashboards",
                  color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
                },
              ].map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={idx}
                    className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className={`size-12 rounded-xl grid place-items-center mb-5 border ${feature.color}`}>
                        <IconComponent className="size-6" />
                      </div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 border-t border-border w-full scroll-mt-16 bg-card/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Get started in 3 steps
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-3">
                Simple onboarding to boost your team productivity immediately
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {/* Connecting Line between steps for desktop */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/30 via-accent-purple/40 to-primary/30 -z-0" />

              {[
                {
                  step: "01",
                  title: "Create your account",
                  desc: "Sign up free in seconds",
                },
                {
                  step: "02",
                  title: "Set up your project",
                  desc: "Add tasks, members, and sprints",
                },
                {
                  step: "03",
                  title: "Track & ship",
                  desc: "Monitor progress and hit deadlines",
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="relative z-10 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 text-center shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all duration-300"
                >
                  <div className="size-14 rounded-2xl gradient-primary text-white font-extrabold text-lg grid place-items-center mx-auto mb-6 shadow-glow">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ROLE CARDS SECTION */}
        <section id="demo" className="py-24 border-t border-border w-full scroll-mt-16 bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Choose your workspace
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-3">
                Experience tailored viewports customized for your organization role
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* ADMIN CONSOLE CARD */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/80 to-slate-900 border border-purple-500/30 rounded-3xl p-8 sm:p-10 text-white shadow-elevated flex flex-col justify-between group hover:border-purple-500/60 transition-all duration-300">
                <div className="absolute top-0 right-0 size-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="size-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 grid place-items-center mb-6 shadow-soft">
                    <Shield className="size-7 text-purple-300" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold tracking-tight text-white">ADMIN CONSOLE</h3>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Management
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-200/80 mb-8 leading-relaxed">
                    Full organizational authority to oversee projects, teams, metrics, and global settings.
                  </p>

                  <ul className="space-y-3 mb-10 text-xs sm:text-sm text-purple-100">
                    {[
                      "Full project control",
                      "Team management",
                      "Reports & analytics",
                      "Sprint oversight",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="size-4 text-purple-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/admin"
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Admin Console</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              {/* MEMBER WORKSPACE CARD */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/80 to-slate-900 border border-blue-500/30 rounded-3xl p-8 sm:p-10 text-white shadow-elevated flex flex-col justify-between group hover:border-blue-500/60 transition-all duration-300">
                <div className="absolute top-0 right-0 size-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="size-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 grid place-items-center mb-6 shadow-soft">
                    <User className="size-7 text-blue-300" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold tracking-tight text-white">MEMBER WORKSPACE</h3>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Productivity
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-200/80 mb-8 leading-relaxed">
                    Personalized view focused on assigned tasks, sprint boards, timelines, and recent activity.
                  </p>

                  <ul className="space-y-3 mb-10 text-xs sm:text-sm text-blue-100">
                    {[
                      "My assigned tasks",
                      "Sprint progress",
                      "Calendar view",
                      "Activity feed",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/app"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Member Workspace</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA SECTION */}
        <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 sm:p-16 text-center text-white shadow-elevated">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Ready to ship faster?
            </h2>
            <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto mb-8 font-medium">
              Join your team on Nexus.io today. Free forever.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-900 text-sm font-extrabold shadow-elevated hover:bg-white/95 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>Get started free</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="border-t border-border bg-card py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg gradient-primary grid place-items-center shadow-glow">
                <div className="size-3 rounded-sm bg-white/30 border border-white/80" />
              </div>
              <span className="font-bold tracking-tight text-foreground text-sm">Nexus.io</span>
            </div>
            <p className="text-xs text-muted-foreground">Built for modern teams</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors cursor-pointer">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors cursor-pointer">
              How it works
            </a>
            <Link to="/login" className="hover:text-primary transition-colors cursor-pointer">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-primary transition-colors cursor-pointer">
              Register
            </Link>
          </div>

          {/* License & GitHub link */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2 text-xs text-muted-foreground">
            <div>© 2026 Nexus.io · MIT License · Built with React & Express</div>
            <a
              href="https://github.com/AbirhossenCSE/Project-Management"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
            >
              <Github className="size-3.5" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

