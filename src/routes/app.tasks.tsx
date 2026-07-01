import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type TaskStatus } from "@/data/mock";
import { KanbanBoard } from "@/components/shared/Kanban";
import { DeleteTaskDialog, TaskFormDialog } from "@/components/shared/TaskFormDialog";
import { getMe } from "@/services/auth.service";
import { useTasks } from "@/hooks";
import type { TaskItem } from "@/hooks/useTasks";

export const Route = createFileRoute("/app/tasks")({
  component: MyTasks,
});

function MyTasks() {
  const { tasks, loading, error, refetch } = useTasks();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserError, setCurrentUserError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const [defaults, setDefaults] = useState<{ status?: TaskStatus; assignee?: string } | undefined>();
  const [deleting, setDeleting] = useState<TaskItem | null>(null);

  useEffect(() => {
    let mounted = true;

    void getMe()
      .then((response) => {
        if (!mounted) return;
        setCurrentUserId(response.data.user.id);
      })
      .catch((err) => {
        if (!mounted) return;
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load your profile";
        setCurrentUserError(message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const mine = useMemo(
    () => tasks.filter((task) => {
      if (!currentUserId) return false;
      if (typeof task.assignee === "object" && task.assignee) {
        return task.assignee._id === currentUserId;
      }
      return task.assignee === currentUserId;
    }),
    [tasks, currentUserId],
  );

  function openCreate(status?: TaskStatus) {
    setEditing(null);
    setDefaults(status ? { status } : undefined);
    setFormOpen(true);
  }

  if (loading || !currentUserId) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading your tasks...
        </div>
      </div>
    );
  }

  if (error || currentUserError) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error ?? currentUserError}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">{mine.length} tasks assigned to you</p>
        </div>
        <button
          onClick={() => openCreate()}
          className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2"
        >
          <Plus className="size-3.5" /> New Task
        </button>
      </div>
      <KanbanBoard
        tasks={mine}
        mode="api"
        refetch={refetch}
        onCreate={(status) => openCreate(status)}
        onEdit={(t) => {
          setEditing(t);
          setDefaults(undefined);
          setFormOpen(true);
        }}
        onDelete={(t) => setDeleting(t)}
      />
      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editing}
        defaults={defaults}
        projectId={editing ? (typeof editing.project === "object" ? editing.project._id : editing.project) : undefined}
        refetch={refetch}
      />
      <DeleteTaskDialog task={deleting} open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} refetch={refetch} />
    </div>
  );
}