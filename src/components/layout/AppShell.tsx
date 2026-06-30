import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, Zap, ListChecks, Users, BarChart3, Settings,
  Search, Bell, Plus, Command, CalendarDays, Activity, Menu, Sun, LogOut,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "../shared/Avatar";
import { logout } from "@/services/auth.service";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; badge?: string };

const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, badge: "6" },
  { to: "/admin/sprints", label: "Sprints", icon: Zap },
  { to: "/admin/tasks", label: "Tasks", icon: ListChecks, badge: "12" },
  { to: "/admin/teams", label: "Teams", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const userNav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/tasks", label: "My Tasks", icon: ListChecks, badge: "7" },
  { to: "/app/projects", label: "Projects", icon: FolderKanban },
  { to: "/app/sprints", label: "Sprints", icon: Zap },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/activity", label: "Activity", icon: Activity },
];

export function AppShell({
  role,
  breadcrumb,
  actions,
  children,
}: {
  role: "admin" | "user";
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const items = role === "admin" ? adminNav : userNav;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileMember = role === "admin"
    ? { id: "m1", name: "Sarah Jenkins" }
    : { id: "m2", name: "Marcus Yao" };
  const profileLabel = role === "admin" ? "Admin · Workspace owner" : "Member · Engineering";

  function handleLogout() {
    logout();
    setMobileOpen(false);
    void navigate({ to: "/login" });
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar flex flex-col transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-16 px-6 flex items-center gap-2.5 border-b border-border">
          <div className="size-8 rounded-lg gradient-primary grid place-items-center shadow-glow">
            <div className="size-3.5 rounded-sm bg-white/30 border-2 border-white/70" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight text-sm">Nexus.io</span>
            <span className="text-[10px] text-muted-foreground">{role === "admin" ? "Admin Console" : "Workspace"}</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
            {role === "admin" ? "Platform" : "Workspace"}
          </div>
          {items.map((item) => {
            const active =
              item.to === (role === "admin" ? "/admin" : "/app")
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group",
                  active
                    ? "bg-primary/10 text-primary font-medium shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("size-4 shrink-0 transition-transform group-hover:scale-110", active && "text-primary")} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-semibold",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">Teams</div>
            {[
              { name: "Engineering", color: "oklch(0.52 0.22 268)" },
              { name: "Design System", color: "oklch(0.62 0.2 295)" },
              { name: "Product", color: "oklch(0.78 0.16 75)" },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-3 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer rounded-md hover:bg-muted">
                <div className="size-2 rounded-full" style={{ background: t.color }} />
                {t.name}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to={role === "admin" ? "/app" : "/admin"}
            className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-primary rounded-md hover:bg-muted transition-colors mb-2"
          >
            <span>Switch to {role === "admin" ? "Member" : "Admin"} view</span>
            <span>→</span>
          </Link>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
            <MemberAvatar member={profileMember} size={32} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{role === "admin" ? "Sarah Jenkins" : "Marcus Yao"}</div>
              <div className="text-[10px] text-muted-foreground truncate">{profileLabel}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "mt-2 flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <LogOut className="size-4 shrink-0 transition-transform group-hover:scale-110" />
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/70 glass flex items-center justify-between px-4 sm:px-8 gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-1.5 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="text-sm text-muted-foreground truncate">{breadcrumb}</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks, projects…"
                className="bg-muted/60 border border-transparent focus:border-primary/30 focus:bg-card rounded-md py-1.5 pl-9 pr-16 text-xs w-72 outline-none transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-mono text-muted-foreground">
                  <Command className="size-2.5 inline" />K
                </kbd>
              </div>
            </div>
            <button className="relative p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
            </button>
            <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:block" aria-label="Theme">
              <Sun className="size-4" />
            </button>
            {actions ?? (
              <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-90 shadow-glow transition-all inline-flex items-center gap-1.5">
                <Plus className="size-3.5" /> New
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="animate-fade-up">{children ?? <Outlet />}</div>
        </div>
      </main>
    </div>
  );
}