import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Workspace — Nexus.io" }] }),
  component: () => <AppShell role="user"><Outlet /></AppShell>,
});