export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type ProjectStatus = "on_track" | "at_risk" | "delayed" | "completed";

export interface Member {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  productivity: number;
  tasksDone: number;
  tasksOpen: number;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  budget: number;
  spent: number;
  startDate: string;
  dueDate: string;
  team: string[];
  tasksTotal: number;
  tasksDone: number;
  color: string;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  start: string;
  end: string;
  progress: number;
  velocity: number;
  status: "active" | "planned" | "completed";
  totalPoints: number;
  completedPoints: number;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  projectId: string;
  sprintId?: string;
  dueDate: string;
  estimate: number;
  comments: number;
  attachments: number;
  tags: string[];
  subtasks?: { id: string; title: string; done: boolean }[];
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "comment" | "status" | "file" | "create" | "assign";
}

export const members: Member[] = [
  { id: "m1", name: "Sarah Jenkins", initials: "SJ", email: "sarah@nexus.io", role: "Admin", department: "Leadership", skills: ["Strategy", "Planning"], productivity: 94, tasksDone: 128, tasksOpen: 7, color: "oklch(0.52 0.22 268)" },
  { id: "m2", name: "Marcus Yao", initials: "MY", email: "marcus@nexus.io", role: "Engineer", department: "Engineering", skills: ["TypeScript", "React", "Node"], productivity: 88, tasksDone: 96, tasksOpen: 12, color: "oklch(0.74 0.13 215)" },
  { id: "m3", name: "Lena Smith", initials: "LS", email: "lena@nexus.io", role: "Designer", department: "Design", skills: ["Figma", "Prototyping"], productivity: 91, tasksDone: 74, tasksOpen: 9, color: "oklch(0.62 0.2 295)" },
  { id: "m4", name: "Diego Park", initials: "DP", email: "diego@nexus.io", role: "Engineer", department: "Engineering", skills: ["Go", "Postgres"], productivity: 82, tasksDone: 58, tasksOpen: 5, color: "oklch(0.68 0.16 155)" },
  { id: "m5", name: "Priya Kapoor", initials: "PK", email: "priya@nexus.io", role: "PM", department: "Product", skills: ["Roadmaps", "Discovery"], productivity: 87, tasksDone: 42, tasksOpen: 8, color: "oklch(0.78 0.16 75)" },
  { id: "m6", name: "Leo Wu", initials: "LW", email: "leo@nexus.io", role: "QA", department: "Engineering", skills: ["Cypress", "Testing"], productivity: 79, tasksDone: 36, tasksOpen: 11, color: "oklch(0.6 0.22 25)" },
  { id: "m7", name: "Aisha Khan", initials: "AK", email: "aisha@nexus.io", role: "Designer", department: "Design", skills: ["Motion", "Brand"], productivity: 90, tasksDone: 51, tasksOpen: 6, color: "oklch(0.55 0.2 320)" },
  { id: "m8", name: "Tom Hayes", initials: "TH", email: "tom@nexus.io", role: "DevOps", department: "Engineering", skills: ["AWS", "Terraform"], productivity: 85, tasksDone: 44, tasksOpen: 4, color: "oklch(0.65 0.15 195)" },
];

export const projects: Project[] = [
  { id: "p1", name: "Quantum Cloud Platform", client: "Atlas Corp", description: "Next-gen multi-region cloud orchestration platform with realtime telemetry.", progress: 68, status: "on_track", budget: 240000, spent: 162000, startDate: "Jan 12, 2026", dueDate: "Jul 30, 2026", team: ["m1", "m2", "m4", "m8"], tasksTotal: 142, tasksDone: 96, color: "oklch(0.52 0.22 268)" },
  { id: "p2", name: "Aurora Design System", client: "Internal", description: "Unified component library and design tokens for product suite.", progress: 84, status: "on_track", budget: 80000, spent: 54000, startDate: "Feb 02, 2026", dueDate: "Jun 15, 2026", team: ["m3", "m7", "m5"], tasksTotal: 86, tasksDone: 72, color: "oklch(0.62 0.2 295)" },
  { id: "p3", name: "Pulse Analytics", client: "Wavelength Inc", description: "Realtime event analytics dashboard with anomaly detection.", progress: 41, status: "at_risk", budget: 175000, spent: 98000, startDate: "Mar 18, 2026", dueDate: "Sep 12, 2026", team: ["m2", "m4", "m6"], tasksTotal: 104, tasksDone: 43, color: "oklch(0.74 0.13 215)" },
  { id: "p4", name: "Ledger v2 Migration", client: "Northwind Bank", description: "Migrate legacy ledger to event-sourced architecture.", progress: 22, status: "delayed", budget: 320000, spent: 105000, startDate: "Apr 04, 2026", dueDate: "Nov 22, 2026", team: ["m1", "m4", "m6", "m8"], tasksTotal: 168, tasksDone: 37, color: "oklch(0.78 0.16 75)" },
  { id: "p5", name: "Halo Mobile App", client: "Mercury Health", description: "Patient companion app for chronic care management.", progress: 95, status: "completed", budget: 140000, spent: 132000, startDate: "Nov 08, 2025", dueDate: "May 30, 2026", team: ["m3", "m7", "m5", "m6"], tasksTotal: 92, tasksDone: 88, color: "oklch(0.68 0.16 155)" },
  { id: "p6", name: "Onyx CMS Redesign", client: "Editorial House", description: "Editorial workflow overhaul with collaborative editing.", progress: 58, status: "on_track", budget: 95000, spent: 51000, startDate: "Feb 24, 2026", dueDate: "Aug 02, 2026", team: ["m3", "m7", "m2"], tasksTotal: 71, tasksDone: 41, color: "oklch(0.55 0.2 320)" },
];

export const sprints: Sprint[] = [
  { id: "s1", name: "Sprint 14 — Realtime Pipes", projectId: "p1", start: "May 12", end: "May 26", progress: 72, velocity: 38, status: "active", totalPoints: 52, completedPoints: 37 },
  { id: "s2", name: "Sprint 09 — Tokens v3", projectId: "p2", start: "May 14", end: "May 28", progress: 64, velocity: 28, status: "active", totalPoints: 34, completedPoints: 22 },
  { id: "s3", name: "Sprint 06 — Ingest Layer", projectId: "p3", start: "May 18", end: "Jun 01", progress: 31, velocity: 19, status: "active", totalPoints: 48, completedPoints: 15 },
  { id: "s4", name: "Sprint 02 — Event Store", projectId: "p4", start: "May 20", end: "Jun 03", progress: 18, velocity: 12, status: "active", totalPoints: 60, completedPoints: 11 },
  { id: "s5", name: "Sprint 15 — Edge Cache", projectId: "p1", start: "May 27", end: "Jun 10", progress: 0, velocity: 0, status: "planned", totalPoints: 44, completedPoints: 0 },
  { id: "s6", name: "Sprint 13 — API Surface", projectId: "p1", start: "Apr 28", end: "May 12", progress: 100, velocity: 41, status: "completed", totalPoints: 41, completedPoints: 41 },
];

export const tasks: Task[] = [
  { id: "t1", key: "QCP-142", title: "Refactor authentication middleware for v2 API", description: "Migrate JWT validation to async handler and add refresh token rotation.", status: "todo", priority: "high", assignee: "m2", projectId: "p1", sprintId: "s1", dueDate: "May 24", estimate: 6, comments: 4, attachments: 2, tags: ["backend", "security"], subtasks: [{ id: "st1", title: "Audit current middleware", done: true }, { id: "st2", title: "Implement async validator", done: false }, { id: "st3", title: "Add refresh rotation", done: false }] },
  { id: "t2", key: "QCP-148", title: "Implement realtime notification websockets", description: "Wire WS gateway to notification fanout service.", status: "todo", priority: "medium", assignee: "m4", projectId: "p1", sprintId: "s1", dueDate: "May 28", estimate: 8, comments: 7, attachments: 1, tags: ["backend", "realtime"] },
  { id: "t3", key: "ADS-22", title: "Design mobile responsive sidebar navigation", description: "Collapsible sidebar with swipe-to-close on touch devices.", status: "in_progress", priority: "high", assignee: "m3", projectId: "p2", sprintId: "s2", dueDate: "May 26", estimate: 5, comments: 3, attachments: 5, tags: ["ui/ux", "mobile"] },
  { id: "t4", key: "QCP-151", title: "Optimize dashboard query batching", description: "Combine N+1 calls into single batched RPC.", status: "in_progress", priority: "urgent", assignee: "m2", projectId: "p1", sprintId: "s1", dueDate: "May 23", estimate: 4, comments: 9, attachments: 0, tags: ["backend", "performance"] },
  { id: "t5", key: "PUL-18", title: "Anomaly detection model v0.3", description: "Switch from IQR to isolation forest with rolling baseline.", status: "in_progress", priority: "medium", assignee: "m4", projectId: "p3", sprintId: "s3", dueDate: "May 30", estimate: 12, comments: 5, attachments: 3, tags: ["ml", "backend"] },
  { id: "t6", key: "ADS-25", title: "Token export pipeline for Figma plugin", description: "Pipe Aurora tokens to Figma variables via plugin.", status: "review", priority: "medium", assignee: "m7", projectId: "p2", sprintId: "s2", dueDate: "May 25", estimate: 3, comments: 2, attachments: 1, tags: ["design", "tooling"] },
  { id: "t7", key: "QCP-138", title: "Fix CSS grid overflow on dashboard cards", description: "Cards overflow viewport on 1280px and below.", status: "review", priority: "low", assignee: "m3", projectId: "p1", sprintId: "s1", dueDate: "May 22", estimate: 2, comments: 1, attachments: 0, tags: ["bug", "ui/ux"] },
  { id: "t8", key: "HAL-71", title: "Onboarding flow A/B test wiring", description: "Hook variant selector into analytics events.", status: "review", priority: "medium", assignee: "m5", projectId: "p5", dueDate: "May 24", estimate: 4, comments: 6, attachments: 2, tags: ["product", "experiment"] },
  { id: "t9", key: "QCP-120", title: "Setup CI matrix for edge runtimes", description: "Cloudflare + Deno + Bun job matrix.", status: "done", priority: "high", assignee: "m8", projectId: "p1", dueDate: "May 18", estimate: 5, comments: 3, attachments: 0, tags: ["devops", "ci"] },
  { id: "t10", key: "ADS-19", title: "Document color token semantics", description: "MDX doc with usage examples.", status: "done", priority: "low", assignee: "m7", projectId: "p2", dueDate: "May 17", estimate: 2, comments: 1, attachments: 4, tags: ["docs", "design"] },
  { id: "t11", key: "ONX-44", title: "Collaborative cursors prototype", description: "CRDT-backed multi-cursor demo for editorial.", status: "done", priority: "medium", assignee: "m2", projectId: "p6", dueDate: "May 15", estimate: 9, comments: 11, attachments: 2, tags: ["realtime", "feature"] },
  { id: "t12", key: "QCP-152", title: "Audit log retention policy", description: "Tiered retention with cold storage spillover.", status: "todo", priority: "low", assignee: "m8", projectId: "p1", sprintId: "s1", dueDate: "Jun 02", estimate: 3, comments: 0, attachments: 0, tags: ["devops", "compliance"] },
];

export const activities: Activity[] = [
  { id: "a1", user: "Marcus Yao", action: "marked as done", target: "QCP-120 Setup CI matrix", time: "14m ago", type: "status" },
  { id: "a2", user: "Lena Smith", action: "attached 4 files to", target: "Q3 Strategy Roadmap", time: "2h ago", type: "file" },
  { id: "a3", user: "Diego Park", action: "commented on", target: "PUL-18 Anomaly detection", time: "3h ago", type: "comment" },
  { id: "a4", user: "Priya Kapoor", action: "created sprint", target: "Sprint 15 — Edge Cache", time: "Yesterday", type: "create" },
  { id: "a5", user: "Sarah Jenkins", action: "assigned QCP-151 to", target: "Marcus Yao", time: "Yesterday", type: "assign" },
  { id: "a6", user: "Tom Hayes", action: "initialized repo", target: "nexus-cli-tools", time: "2 days ago", type: "create" },
  { id: "a7", user: "Aisha Khan", action: "updated status of", target: "ADS-25 Token export", time: "2 days ago", type: "status" },
];

export const productivitySeries = [
  { day: "Mon", done: 18, opened: 22 },
  { day: "Tue", done: 24, opened: 19 },
  { day: "Wed", done: 16, opened: 27 },
  { day: "Thu", done: 32, opened: 24 },
  { day: "Fri", done: 28, opened: 21 },
  { day: "Sat", done: 9, opened: 6 },
  { day: "Sun", done: 11, opened: 4 },
];

export const burndownSeries = [
  { day: "D1", ideal: 52, actual: 52 },
  { day: "D2", ideal: 48, actual: 50 },
  { day: "D3", ideal: 44, actual: 47 },
  { day: "D4", ideal: 40, actual: 41 },
  { day: "D5", ideal: 36, actual: 38 },
  { day: "D6", ideal: 32, actual: 30 },
  { day: "D7", ideal: 28, actual: 26 },
  { day: "D8", ideal: 24, actual: 22 },
  { day: "D9", ideal: 20, actual: 21 },
  { day: "D10", ideal: 16, actual: 18 },
];

export const statusColor = (s: ProjectStatus) =>
  s === "on_track" ? "success" : s === "at_risk" ? "warning" : s === "delayed" ? "destructive" : "info";

export const priorityColor = (p: Priority) =>
  p === "urgent" ? "destructive" : p === "high" ? "warning" : p === "medium" ? "info" : "muted";

export const findMember = (id: string) => members.find((m) => m.id === id)!;
export const findProject = (id: string) => projects.find((p) => p.id === id)!;
export const findTask = (id: string) => tasks.find((t) => t.id === id)!;
export const findSprint = (id: string) => sprints.find((s) => s.id === id)!;