import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/mpms/AppShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Nexus.io" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShell role="admin">
      <Outlet />
    </AppShell>
  );
}