import { MessageSquare, Paperclip, Clock, MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Task, type TaskStatus } from "@/data/mock";
import { MemberAvatar } from "./Avatar";
import { PriorityBadge, Tag } from "./Badges";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COLUMNS: { id: TaskStatus; label: string; accent: string }[] = [
  { id: "todo", label: "To Do", accent: "bg-muted-foreground" },
  { id: "in_progress", label: "In Progress", accent: "bg-primary" },
  { id: "review", label: "Review", accent: "bg-accent-cyan" },
  { id: "done", label: "Done", accent: "bg-success" },
];

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}) {
  return (
    <div
      onClick={() => onEdit?.(task)}
      className="bg-card border border-border rounded-xl p-3.5 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/30 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-muted-foreground">{task.key}</span>
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
        {task.title}
      </div>
      <div className="flex gap-1 flex-wrap mb-3">
        {task.tags.slice(0, 2).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Clock className="size-3" />{task.dueDate}</span>
          {task.comments > 0 && <span className="inline-flex items-center gap-1"><MessageSquare className="size-3" />{task.comments}</span>}
          {task.attachments > 0 && <span className="inline-flex items-center gap-1"><Paperclip className="size-3" />{task.attachments}</span>}
        </div>
        <MemberAvatar
          member={typeof task.assignee === "object" && task.assignee
            ? task.assignee
            : { id: task.assignee, name: task.assignee }}
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
}: {
  tasks: Task[];
  onCreate?: (status: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[60vh]">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="flex flex-col bg-muted/40 rounded-2xl border border-border p-3">
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
                  <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { COLUMNS as KanbanColumns };
export { MoreHorizontal };