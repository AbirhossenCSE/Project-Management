import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getMe } from "@/services/auth.service";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Nexus.io" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void getMe()
      .then((response) => {
        if (cancelled) return;

        if (response.data.user.role === "member") {
          void navigate({ to: "/app" });
          return;
        }

        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" /> Checking access...
        </div>
      </div>
    );
  }

  return (
    <AppShell role="admin">
      <Outlet />
    </AppShell>
  );
}