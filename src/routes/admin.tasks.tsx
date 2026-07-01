import { createFileRoute } from "@tanstack/react-router";
import { Filter, LayoutGrid, List, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { type TaskStatus } from "@/data/mock";
import { KanbanBoard } from "@/components/shared/Kanban";
import { PriorityBadge, TaskStatusBadge, Tag } from "@/components/shared/Badges";
import { MemberAvatar } from "@/components/shared/Avatar";
import { TaskFormDialog } from "@/components/shared/TaskFormDialog";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks";
import type { TaskItem } from "@/hooks/useTasks";
import { deleteTask } from "@/services/task.service";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Admin" }] }),
  component: Tasks,
});

function Tasks() {
  const [view, setView] = useState<"board" | "table">("board");
  const { tasks, loading, error, refetch } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const [defaults, setDefaults] = useState<{ status?: TaskStatus } | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreate(status?: TaskStatus) {
    setEditing(null);
    setDefaults(status ? { status } : undefined);
    setFormOpen(true);
  }
  function openEdit(task: TaskItem) {
    setEditing(task);
    setDefaults(undefined);
    setFormOpen(true);
  }

  async function handleDelete(task: TaskItem) {
    if (!window.confirm(`Delete task ${task._id.slice(-6).toUpperCase()}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(task._id);
    try {
      await deleteTask(task._id);
      await refetch();
      toast.success("Task deleted");
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to delete task";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading tasks...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">{tasks.length} tasks across {new Set(tasks.map((task) => (typeof task.project === "object" ? task.project?._id : task.project))).size} projects</p>
        </div>
        <button
          onClick={() => openCreate()}
          className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2"
        >
          <Plus className="size-3.5" /> New Task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-xl p-2 shadow-soft">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input placeholder="Search tasks, IDs, assignees..." className="w-full bg-transparent pl-9 pr-3 py-1.5 text-xs outline-none" />
        </div>
        {["Status", "Priority", "Assignee", "Project"].map((f) => (
          <button key={f} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-muted">
            <Filter className="size-3.5" /> {f}
          </button>
        ))}
        <div className="bg-muted rounded-md p-0.5 flex">
          <button onClick={() => setView("board")} className={cn("p-1.5 rounded", view === "board" ? "bg-card shadow-soft text-primary" : "text-muted-foreground")}>
            <LayoutGrid className="size-3.5" />
          </button>
          <button onClick={() => setView("table")} className={cn("p-1.5 rounded", view === "table" ? "bg-card shadow-soft text-primary" : "text-muted-foreground")}>
            <List className="size-3.5" />
          </button>
        </div>
      </div>

      {view === "board" ? (
        <KanbanBoard
          tasks={tasks}
          mode="api"
          refetch={refetch}
          onCreate={(status) => openCreate(status)}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">ID</th>
                <th className="text-left px-4 py-3 font-semibold">Title</th>
                <th className="text-left px-4 py-3 font-semibold">Project</th>
                <th className="text-left px-4 py-3 font-semibold">Assignee</th>
                <th className="text-left px-4 py-3 font-semibold">Priority</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Due</th>
                <th className="px-4 py-3 font-semibold w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((t) => {
                const p = typeof t.project === "object" ? t.project : undefined;
                const m = typeof t.assignee === "object" ? t.assignee : undefined;
                return (
                  <tr key={t._id} onClick={() => openEdit(t)} className="hover:bg-muted/40 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{t._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{t.title}</div>
                      <div className="mt-1 flex gap-1"><Tag>task</Tag></div>
                    </td>
                    <td className="px-4 py-3 text-xs">{p?.name ?? "Unassigned project"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2"><MemberAvatar member={m ?? { name: "Unknown" }} size={22} /><span className="text-xs">{m?.name?.split(" ")[0] ?? "Unknown"}</span></div>
                    </td>
                    <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-4 py-3"><TaskStatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-muted-foreground">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Edit task"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => void handleDelete(t)}
                          disabled={deletingId === t._id}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Delete task"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editing}
        defaults={defaults}
        projectId={editing ? (typeof editing.project === "object" ? editing.project._id : editing.project) : undefined}
        refetch={refetch}
      />
    </div>
  );
}