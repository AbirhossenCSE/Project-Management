import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { type Task, type TaskStatus } from "@/data/mock";
import { useTasks } from "@/data/taskStore";
import { KanbanBoard } from "@/components/mpms/Kanban";
import { DeleteTaskDialog, TaskFormDialog } from "@/components/mpms/TaskFormDialog";

const ME = "m2";

export const Route = createFileRoute("/app/tasks")({
  component: MyTasks,
});

function MyTasks() {
  const tasks = useTasks();
  const mine = tasks.filter((t) => t.assignee === ME);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [defaults, setDefaults] = useState<{ status?: TaskStatus; assignee?: string } | undefined>();
  const [deleting, setDeleting] = useState<Task | null>(null);

  function openCreate(status?: TaskStatus) {
    setEditing(null);
    setDefaults({ status, assignee: ME });
    setFormOpen(true);
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
        onCreate={(status) => openCreate(status)}
        onEdit={(t) => {
          setEditing(t);
          setDefaults(undefined);
          setFormOpen(true);
        }}
        onDelete={(t) => setDeleting(t)}
      />
      <TaskFormDialog open={formOpen} onOpenChange={setFormOpen} task={editing} defaults={defaults} />
      <DeleteTaskDialog task={deleting} open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} />
    </div>
  );
}