import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, Zap, ListChecks, Users, BarChart3, Settings,
  Search, Bell, Plus, Command, CalendarDays, Activity, Menu, Sun, LogOut, Moon,
} from "lucide-react";
import { useState, type ReactNode, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "../shared/Avatar";
import { logout } from "@/services/auth.service";
import { useAuthUser } from "./auth-user-context";
import { useProjects, useTasks } from "@/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

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
  const { user } = useAuthUser();
  const profileMember = user ? { id: user.id, name: user.name, avatar: user.avatar } : { id: role === "admin" ? "m1" : "m2", name: role === "admin" ? "Admin" : "Member" };
  const profileLabel = user ? `${user.role === "admin" ? "Admin" : "Member"} · ${user.email}` : (role === "admin" ? "Admin · Workspace owner" : "Member · Engineering");

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
              <div className="text-xs font-semibold truncate">{user?.name ?? (role === "admin" ? "Admin" : "Member")}</div>
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
        <header className="relative z-[100] h-16 border-b border-border bg-card/70 glass flex items-center justify-between px-4 sm:px-8 gap-4 shrink-0 overflow-visible">
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
            {/* Search Input with Autocomplete dropdown */}
            <div className="relative hidden md:block z-[9999]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tasks, projects…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setSearchOpen(false), 200);
                  }}
                  className="bg-muted/60 border border-transparent focus:border-primary/30 focus:bg-card rounded-md py-1.5 pl-9 pr-16 text-xs w-72 outline-none transition-all text-foreground"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-mono text-muted-foreground">
                    <Command className="size-2.5 inline" />K
                  </kbd>
                </div>

                {/* Autocomplete dropdown directly below search bar */}
                {searchOpen && (
                  <div 
                    className="absolute border border-border max-h-[350px] overflow-y-auto"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      zIndex: 99999,
                      minWidth: "400px",
                      background: "var(--card, white)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <SearchDropdownContent 
                      searchQuery={searchQuery}
                      role={role} 
                      navigate={navigate} 
                      setOpen={setSearchOpen} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Notification bell dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <Bell className="size-4" />
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-xs text-muted-foreground justify-center py-3">
                  No notifications yet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:block cursor-pointer" 
              aria-label="Theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {actions}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="animate-fade-up">{children ?? <Outlet />}</div>
        </div>
      </main>
    </div>
  );
}

function SearchDropdownContent({
  searchQuery,
  role,
  navigate,
  setOpen,
}: {
  searchQuery: string;
  role: "admin" | "user";
  navigate: any;
  setOpen: (open: boolean) => void;
}) {
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const query = searchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!query) return projects.slice(0, 5);
    return projects.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);
  }, [projects, query]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (!query) return tasks.slice(0, 5);
    return tasks.filter((t) => t.title.toLowerCase().includes(query)).slice(0, 5);
  }, [tasks, query]);

  const hasResults = filteredProjects.length > 0 || filteredTasks.length > 0;

  return (
    <div className="p-2 space-y-3 text-xs">
      {!hasResults && (
        <div className="py-6 text-center text-muted-foreground">
          No results found.
        </div>
      )}

      {filteredProjects.length > 0 && (
        <div>
          <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest border-b border-border/40 mb-1">
            Projects
          </div>
          <div className="space-y-0.5">
            {filteredProjects.map((project) => (
              <button
                key={project._id}
                onClick={() => {
                  setOpen(false);
                  void navigate({ to: role === "admin" ? `/admin/projects/${project._id}` : `/app/projects` });
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-left transition-colors cursor-pointer text-[11px]"
              >
                <FolderKanban className="size-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium truncate">{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredTasks.length > 0 && (
        <div>
          <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest border-b border-border/40 mb-1">
            Tasks
          </div>
          <div className="space-y-0.5">
            {filteredTasks.map((task) => (
              <button
                key={task._id}
                onClick={() => {
                  setOpen(false);
                  void navigate({ to: role === "admin" ? `/admin/tasks` : `/app/tasks` });
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-left transition-colors cursor-pointer text-[11px]"
              >
                <ListChecks className="size-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium truncate">{task.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}