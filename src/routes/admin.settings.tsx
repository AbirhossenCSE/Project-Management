import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getMe, type AuthUser } from "@/services/auth.service";
import { useProjects } from "@/hooks";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: Settings,
});

const SECTIONS = ["General", "Workspace", "Members", "Billing", "Integrations", "Notifications", "Security"] as const;

function Settings() {
  const [s, setS] = useState<(typeof SECTIONS)[number]>("General");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const { projects, loading: projectsLoading } = useProjects();

  useEffect(() => {
    let active = true;
    setUserLoading(true);
    getMe()
      .then((res) => {
        if (active && res.success) {
          setUser(res.data.user);
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

    return () => {
      active = false;
    };
  }, []);

  const isLoading = userLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 max-w-[1400px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading settings...
        </div>
      </div>
    );
  }

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
                  <Field label="Full Name" value={user?.name || ""} disabled />
                  <Field label="Email Address" value={user?.email || ""} disabled />
                  <Field label="Role" value={user?.role || ""} disabled />
                  <Field label="Default timezone" value="UTC−05:00 · Eastern Time" />
                  <div>
                    <div className="text-xs font-medium mb-2">Appearance</div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Light", "Dark", "System"].map((t, i) => (
                        <label key={t} className={cn("border rounded-lg p-3 cursor-pointer transition-all", i === 0 ? "border-primary bg-primary/5 ring-2 ring-primary/15" : "border-border hover:border-primary/40")}>
                          <div className="h-12 rounded mb-2" style={{ background: i === 0 ? "linear-gradient(135deg, white, #f1f5f9)" : i === 1 ? "linear-gradient(135deg, #0f172a, #1e293b)" : "linear-gradient(135deg, white, #0f172a)" }} />
                          <div className="text-xs font-medium">{t}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {s === "Workspace" && (
                <>
                  <Field label="Workspace name" value="Nexus.io" />
                  <Field label="Workspace URL" value="nexus.app/workspace/atlas" />
                  <Field label="Total Projects" value={`${projects.length} projects`} disabled />
                </>
              )}

              {s !== "General" && s !== "Workspace" && (
                <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                  {s} settings are currently not available.
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-5 border-t border-border">
              <button className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-muted">Cancel</button>
              <button className="gradient-primary text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-glow">Save changes</button>
            </div>
          </div>

          <div className="bg-card border border-destructive/20 rounded-2xl p-6 shadow-soft">
            <h2 className="text-base font-semibold text-destructive mb-1">Danger zone</h2>
            <p className="text-xs text-muted-foreground mb-4">Permanently delete this workspace and all data.</p>
            <button className="border border-destructive/30 text-destructive px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-destructive/10">Delete workspace</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) {
  return (
    <label className="block">
      <div className="text-xs font-medium mb-1.5">{label}</div>
      <input
        defaultValue={disabled ? undefined : value}
        value={disabled ? value : undefined}
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