import { cn } from "@/lib/utils";
import type { Priority, ProjectStatus } from "@/data/mock";

const tone = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  muted: "bg-muted text-muted-foreground border-border",
  accent: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  cyan: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const label = { on_track: "On Track", at_risk: "At Risk", delayed: "Delayed", completed: "Completed" }[status];
  const t =
    status === "on_track" ? tone.success
      : status === "at_risk" ? tone.warning
        : status === "delayed" ? tone.destructive
          : tone.info;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border", t)}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const t =
    priority === "urgent" ? tone.destructive
      : priority === "high" ? tone.warning
        : priority === "medium" ? tone.info
          : tone.muted;
  return (
    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", t)}>
      {priority}
    </span>
  );
}

type TaskStatusValue = "todo" | "in_progress" | "review" | "done" | "in-progress";

const taskStatusTone: Record<TaskStatusValue, keyof typeof tone> = {
  todo: "muted",
  in_progress: "primary",
  "in-progress": "primary",
  review: "cyan",
  done: "success",
};

export function TaskStatusBadge({ status }: { status: TaskStatusValue }) {
  const label = { todo: "To Do", in_progress: "In Progress", "in-progress": "In Progress", review: "Review", done: "Done" }[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border", tone[taskStatusTone[status]])}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function Tag({ children, tone: t = "muted" }: { children: React.ReactNode; tone?: keyof typeof tone }) {
  return <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border", tone[t])}>{children}</span>;
}