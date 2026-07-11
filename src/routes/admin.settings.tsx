import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getMe, updateMe, changePassword, type AuthUser } from "@/services/auth.service";
import { useProjects, useUsers } from "@/hooks";
import { Loader2, CreditCard, Plug, Bell, ShieldAlert, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { MemberAvatar } from "@/components/shared/Avatar";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: Settings,
});

const SECTIONS = ["General", "Workspace", "Members", "Billing", "Integrations", "Notifications", "Security"] as const;

const TIMEZONES = [
  "UTC−08:00 · Pacific Time",
  "UTC−05:00 · Eastern Time",
  "UTC+00:00 · Coordinated Universal Time (UTC)",
  "UTC+01:00 · Central European Time",
  "UTC+06:00 · Bangladesh Standard Time",
  "UTC+08:00 · Singapore Standard Time",
  "UTC+09:00 · Japan Standard Time",
];

function Settings() {
  const [s, setS] = useState<(typeof SECTIONS)[number]>("General");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // General settings state
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("UTC−05:00 · Eastern Time");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  // Workspace settings state
  const [workspaceName, setWorkspaceName] = useState("Nexus.io");
  const [workspaceUrl, setWorkspaceUrl] = useState("nexus.app/workspace/atlas");

  // Security settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const { projects, loading: projectsLoading } = useProjects();
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    let active = true;
    setUserLoading(true);
    getMe()
      .then((res) => {
        if (active && res.success) {
          setUser(res.data.user);
          setName(res.data.user.name);
        }
      })
      .catch((err) => {
        console.error("Failed to load settings user:", err);
      })
      .finally(() => {
        if (active) {
          setUserLoading(false);
        }
      });

    const savedWorkspaceName = localStorage.getItem("workspaceName") || "Nexus.io";
    setWorkspaceName(savedWorkspaceName);

    const savedWorkspaceUrl = localStorage.getItem("workspaceUrl") || "nexus.app/workspace/atlas";
    setWorkspaceUrl(savedWorkspaceUrl);

    const savedTimezone = localStorage.getItem("timezone") || "UTC−05:00 · Eastern Time";
    setTimezone(savedTimezone);

    const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
    setTheme(savedTheme);

    return () => {
      active = false;
    };
  }, []);

  function applyTheme(t: "light" | "dark" | "system") {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else if (t === "light") {
      root.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }

  function handleThemeChange(t: "light" | "dark" | "system") {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
    toast.success(`Theme changed to ${t}`);
  }

  function handleCancel() {
    if (s === "General") {
      setName(user?.name || "");
      setTimezone(localStorage.getItem("timezone") || "UTC−05:00 · Eastern Time");
    } else if (s === "Workspace") {
      setWorkspaceName(localStorage.getItem("workspaceName") || "Nexus.io");
      setWorkspaceUrl(localStorage.getItem("workspaceUrl") || "nexus.app/workspace/atlas");
    } else if (s === "Security") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function handleSave() {
    setSubmitting(true);
    try {
      if (s === "General") {
        if (!name.trim()) {
          toast.error("Name cannot be empty");
          return;
        }
        const res = await updateMe(name);
        if (res.success) {
          setUser(res.data.user);
          localStorage.setItem("timezone", timezone);
          toast.success("Profile updated successfully!");
        }
      } else if (s === "Workspace") {
        if (!workspaceName.trim()) {
          toast.error("Workspace name cannot be empty");
          return;
        }
        localStorage.setItem("workspaceName", workspaceName);
        localStorage.setItem("workspaceUrl", workspaceUrl);
        toast.success("Workspace updated successfully!");
      } else if (s === "Security") {
        if (!currentPassword || !newPassword || !confirmPassword) {
          toast.error("All password fields are required");
          return;
        }
        if (newPassword !== confirmPassword) {
          toast.error("New passwords do not match");
          return;
        }
        await changePassword({ currentPassword, newPassword });
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  }

  const isLoading = userLoading || projectsLoading || usersLoading;

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 max-w-[1400px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading settings...
        </div>
      </div>
    );
  }

  const showSaveButtons = s === "General" || s === "Workspace" || s === "Security";

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
        <nav className="space-y-0.5">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => setS(sec)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                s === sec ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {sec}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <h2 className="text-base font-semibold mb-1">{s}</h2>
            <p className="text-xs text-muted-foreground mb-6">Configure {s.toLowerCase()} for your workspace.</p>

            <div className="space-y-5">
              {s === "General" && (
                <>
                  <Field label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Field label="Email Address" value={user?.email || ""} disabled />
                  <Field label="Role" value={user?.role || ""} disabled />
                  
                  <div>
                    <div className="text-xs font-medium mb-1.5">Default timezone</div>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 rounded-md px-3 py-2 text-sm outline-none cursor-pointer"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-2">Appearance</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "light" as const, label: "Light" },
                        { id: "dark" as const, label: "Dark" },
                        { id: "system" as const, label: "System" }
                      ].map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleThemeChange(t.id)}
                          className={cn(
                            "border rounded-lg p-3 cursor-pointer transition-all",
                            theme === t.id ? "border-primary bg-primary/5 ring-2 ring-primary/15" : "border-border hover:border-primary/40"
                          )}
                        >
                          <div
                            className="h-12 rounded mb-2"
                            style={{
                              background:
                                t.id === "light"
                                  ? "linear-gradient(135deg, white, #f1f5f9)"
                                  : t.id === "dark"
                                    ? "linear-gradient(135deg, #0f172a, #1e293b)"
                                    : "linear-gradient(135deg, white, #0f172a)"
                            }}
                          />
                          <div className="text-xs font-medium">{t.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {s === "Workspace" && (
                <>
                  <Field label="Workspace name" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                  <Field label="Workspace URL" value={workspaceUrl} onChange={(e) => setWorkspaceUrl(e.target.value)} />
                  <Field label="Total Projects" value={`${projects.length} projects`} disabled />
                  <Field label="Total Members" value={`${users.length} members`} disabled />
                </>
              )}

              {s === "Members" && (
                <div className="space-y-4">
                  <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background">
                    {users.map((member) => (
                      <div key={member._id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <MemberAvatar member={member} size={36} />
                          <div>
                            <div className="text-sm font-semibold text-foreground">{member.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{member.email}</div>
                          </div>
                        </div>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                          member.role === "admin" 
                            ? "bg-purple-500/10 text-purple-600 border border-purple-500/20" 
                            : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                        )}>
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {s === "Security" && (
                <>
                  <Field
                    label="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                  />
                  <Field
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                  />
                  <Field
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                  />
                </>
              )}

              {(s === "Billing" || s === "Integrations" || s === "Notifications") && (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-2xl bg-muted/5 p-6 animate-fade-in">
                  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {s === "Billing" && <CreditCard className="size-6" />}
                    {s === "Integrations" && <Plug className="size-6" />}
                    {s === "Notifications" && <Bell className="size-6" />}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{s} Features</h3>
                  <p className="text-xs text-muted-foreground max-w-[280px] mt-1.5">
                    We're currently working on this feature to improve your workspace experience. Coming soon!
                  </p>
                </div>
              )}
            </div>

            {showSaveButtons && (
              <div className="mt-6 flex justify-end gap-2 pt-5 border-t border-border">
                <button
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={submitting}
                  className="gradient-primary text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-glow disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="size-3 animate-spin" />}
                  Save changes
                </button>
              </div>
            )}
          </div>

          {s === "Workspace" && (
            <div className="bg-card border border-destructive/20 rounded-2xl p-6 shadow-soft">
              <h2 className="text-base font-semibold text-destructive mb-1">Danger zone</h2>
              <p className="text-xs text-muted-foreground mb-4">Permanently delete this workspace and all data.</p>
              <button className="border border-destructive/30 text-destructive px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-destructive/10">Delete workspace</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  disabled,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs font-medium mb-1.5">{label}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={disabled}
        disabled={disabled}
        className={cn(
          "w-full bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 rounded-md px-3 py-2 text-sm outline-none",
          disabled && "opacity-70 cursor-not-allowed bg-muted/50"
        )}
      />
    </label>
  );
}