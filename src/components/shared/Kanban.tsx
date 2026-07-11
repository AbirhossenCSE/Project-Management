import { MessageSquare, Paperclip, Clock, MoreHorizontal, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { type TaskStatus as LegacyTaskStatus } from "@/types";
import { MemberAvatar } from "./Avatar";
import { PriorityBadge, Tag } from "./Badges";
import { updateTask } from "@/services/task.service";
import type { TaskItem } from "@/hooks/useTasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ApiTaskStatus = "todo" | "in-progress" | "done";
type LegacyTaskCardStatus = LegacyTaskStatus;

type KanbanTask = Omit<TaskItem, "status"> & {
  status: ApiTaskStatus | LegacyTaskCardStatus | string;
  tags?: string[];
  comments?: number;
  attachments?: number;
  key?: string;
};

const API_COLUMNS: { id: ApiTaskStatus; label: string; accent: string }[] = [
  { id: "todo", label: "To Do", accent: "bg-muted-foreground" },
  { id: "in-progress", label: "In Progress", accent: "bg-primary" },
  { id: "done", label: "Done", accent: "bg-success" },
];

const LEGACY_COLUMNS: { id: LegacyTaskCardStatus; label: string; accent: string }[] = [
  { id: "todo", label: "To Do", accent: "bg-muted-foreground" },
  { id: "in_progress", label: "In Progress", accent: "bg-primary" },
  { id: "review", label: "Review", accent: "bg-accent-cyan" },
  { id: "done", label: "Done", accent: "bg-success" },
];

function getTaskId(task: KanbanTask) {
  return task._id ?? task.id ?? task.key ?? task.title ?? "";
}

function getTaskAssignee(task: KanbanTask) {
  const assignee = task.assignee;
  if (assignee && typeof assignee === "object") return assignee;
  return { _id: typeof assignee === "string" ? assignee : getTaskId(task), name: "Unassigned" };
}

function getColumns(mode: "api" | "legacy") {
  return mode === "api" ? API_COLUMNS : LEGACY_COLUMNS;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  draggable,
  onDragStart,
  isDragging,
}: {
  task: KanbanTask;
  onEdit?: (task: KanbanTask) => void;
  onDelete?: (task: KanbanTask) => void;
  draggable?: boolean;
  onDragStart?: () => void;
  isDragging?: boolean;
}) {
  const tags = Array.isArray(task.tags) ? task.tags : [];
  const assignee = getTaskAssignee(task);
  const dueDateLabel = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date";
  const displayKey = getTaskId(task).slice(-6).toUpperCase() || "TASK";

  return (
    <div
      onClick={() => onEdit?.(task)}
      draggable={draggable}
      onDragStart={(event) => {
        if (!draggable) return;
        event.dataTransfer.setData("text/plain", getTaskId(task));
        event.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragEnd={() => onDragStart?.()}
      className={cn(
        "bg-card border border-border rounded-xl p-3.5 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/30 transition-all cursor-pointer group",
        draggable && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-60 ring-2 ring-primary/30",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-muted-foreground">{displayKey}</span>
        <div className="flex items-center gap-1">
          <PriorityBadge priority={task.priority} />
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                  <DropdownMenuItem onSelect={() => onEdit(task)}>
                    <Pencil className="size-3.5 mr-2" /> Edit task
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => onDelete(task)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-3.5 mr-2" /> Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="text-sm font-medium leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
        {task.title ?? "Untitled task"}
      </div>
      <div className="flex gap-1 flex-wrap mb-3">
        {tags.slice(0, 2).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Clock className="size-3" />{dueDateLabel}</span>
          {typeof task.comments === "number" && task.comments > 0 && <span className="inline-flex items-center gap-1"><MessageSquare className="size-3" />{task.comments}</span>}
          {typeof task.attachments === "number" && task.attachments > 0 && <span className="inline-flex items-center gap-1"><Paperclip className="size-3" />{task.attachments}</span>}
        </div>
        <MemberAvatar
          member={assignee}
          size={22}
        />
      </div>
    </div>
  );
}

export function KanbanBoard({
  tasks,
  onCreate,
  onEdit,
  onDelete,
  refetch,
  mode = "legacy",
}: {
  tasks: KanbanTask[];
  onCreate?: (status: ApiTaskStatus | LegacyTaskCardStatus) => void;
  onEdit?: (task: KanbanTask) => void;
  onDelete?: (task: KanbanTask) => void;
  refetch?: () => Promise<void> | void;
  mode?: "api" | "legacy";
}) {
  const [visibleTasks, setVisibleTasks] = useState(tasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    setVisibleTasks(tasks);
  }, [tasks]);

  const columns = useMemo(() => getColumns(mode), [mode]);

  async function handleDrop(targetStatus: ApiTaskStatus, taskId: string) {
    if (mode !== "api") return;
    const previousTasks = visibleTasks;
    const targetTask = previousTasks.find((task) => getTaskId(task) === taskId);
    if (!targetTask || targetTask.status === targetStatus) return;

    setUpdatingTaskId(taskId);
    setVisibleTasks((current) => current.map((task) => (getTaskId(task) === taskId ? { ...task, status: targetStatus } : task)));

    try {
      await updateTask(taskId, { status: targetStatus });
      await refetch?.();
    } catch {
      setVisibleTasks(previousTasks);
    } finally {
      setUpdatingTaskId(null);
      setDraggedTaskId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[60vh]">
      {columns.map((col) => {
        const colTasks = visibleTasks.filter((task) => task.status === col.id);
        return (
          <div
            key={col.id}
            className="flex flex-col bg-muted/40 rounded-2xl border border-border p-3"
            onDragOver={(event) => {
              if (mode !== "api") return;
              event.preventDefault();
            }}
            onDrop={(event) => {
              if (mode !== "api") return;
              event.preventDefault();
              const taskId = event.dataTransfer.getData("text/plain") || draggedTaskId;
              if (taskId) {
                void handleDrop(col.id as ApiTaskStatus, taskId);
              }
            }}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", col.accent)} />
                <span className="font-semibold text-sm">{col.label}</span>
                <span className="text-[10px] bg-card border border-border text-muted-foreground px-1.5 rounded-full font-mono">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onCreate?.(col.id)}
                className="text-muted-foreground hover:text-primary p-1 rounded hover:bg-card transition-colors"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <div className="space-y-2.5 flex-1">
              {colTasks.length === 0 ? (
                <button
                  type="button"
                  onClick={() => onCreate?.(col.id)}
                  className="w-full text-center py-8 text-xs text-muted-foreground border-2 border-dashed border-border rounded-xl hover:border-primary/40 hover:text-primary transition-colors"
                >
                  + Add a task
                </button>
              ) : (
                colTasks.map((t) => (
                  <TaskCard
                    key={getTaskId(t)}
                    task={t}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    draggable={mode === "api"}
                    onDragStart={() => setDraggedTaskId(getTaskId(t))}
                    isDragging={updatingTaskId === getTaskId(t)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { API_COLUMNS as KanbanColumns };
export { MoreHorizontal };