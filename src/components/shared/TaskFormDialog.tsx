import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { members, projects, type Priority, type Task, type TaskStatus } from "@/data/mock";
import { createTask, deleteTask, updateTask } from "@/store/taskStore";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Keep titles under 120 characters"),
  description: z.string().trim().max(2000, "Description is too long").optional().or(z.literal("")),
  projectId: z.string().min(1, "Select a project"),
  assignee: z.string().min(1, "Assign a teammate"),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().min(1, "Pick a due date"),
  estimate: z.coerce.number().min(0, "Estimate cannot be negative").max(200, "Estimate too large"),
  tags: z.string().max(200).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

function fmtDueForInput(due?: string) {
  if (!due) return "";
  const d = new Date(`${due}, ${new Date().getFullYear()}`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function fmtDueForDisplay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

const empty = (defaults?: Partial<FormValues>): FormValues => ({
  title: "",
  description: "",
  projectId: projects[0]?.id ?? "",
  assignee: members[0]?.id ?? "",
  status: "todo",
  priority: "medium",
  dueDate: new Date().toISOString().slice(0, 10),
  estimate: 2,
  tags: "",
  ...defaults,
});

export interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaults?: Partial<FormValues>;
}

export function TaskFormDialog({ open, onOpenChange, task, defaults }: TaskFormDialogProps) {
  const isEdit = !!task;
  const [values, setValues] = useState<FormValues>(empty(defaults));
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  useEffect(() => {
    if (!open) return;
    if (task) {
      setValues({
        title: task.title,
        description: task.description ?? "",
        projectId: task.projectId,
        assignee: task.assignee,
        status: task.status,
        priority: task.priority,
        dueDate: fmtDueForInput(task.dueDate),
        estimate: task.estimate ?? 0,
        tags: (task.tags ?? []).join(", "),
      });
    } else {
      setValues(empty(defaults));
    }
    setErrors({});
  }, [open, task, defaults]);

  function update<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    const data = parsed.data;
    const tags = (data.tags ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
    const payload = {
      title: data.title,
      description: data.description ?? "",
      projectId: data.projectId,
      assignee: data.assignee,
      status: data.status,
      priority: data.priority,
      dueDate: fmtDueForDisplay(data.dueDate),
      estimate: data.estimate,
      tags,
    };
    if (isEdit && task) {
      updateTask(task.id, payload);
      toast.success("Task updated", { description: data.title });
    } else {
      const created = createTask(payload);
      toast.success("Task created", { description: `${created.key} · ${created.title}` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-border">
            <DialogTitle className="text-lg">{isEdit ? "Edit task" : "Create a new task"}</DialogTitle>
            <DialogDescription className="text-xs">
              {isEdit ? `Editing ${task?.key}` : "Add details, assign a teammate, and set a due date."}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <Field label="Title" error={errors.title} required>
              <Input
                autoFocus
                value={values.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Refactor authentication middleware"
                maxLength={120}
              />
            </Field>

            <Field label="Description" error={errors.description}>
              <Textarea
                rows={3}
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Add context, acceptance criteria, or links..."
                maxLength={2000}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Project" error={errors.projectId} required>
                <Select value={values.projectId} onValueChange={(v) => update("projectId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Assignee" error={errors.assignee} required>
                <Select value={values.assignee} onValueChange={(v) => update("assignee", v)}>
                  <SelectTrigger><SelectValue placeholder="Assign to" /></SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <span className="inline-flex items-center gap-2">
                          <span className="size-5 rounded-full inline-flex items-center justify-center text-[9px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</span>
                          {m.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status" error={errors.status} required>
                <Select value={values.status} onValueChange={(v) => update("status", v as TaskStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Priority" error={errors.priority} required>
                <Select value={values.priority} onValueChange={(v) => update("priority", v as Priority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Due date" error={errors.dueDate} required>
                <Input
                  type="date"
                  value={values.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                />
              </Field>

              <Field label="Estimate (hours)" error={errors.estimate}>
                <Input
                  type="number"
                  min={0}
                  max={200}
                  value={values.estimate}
                  onChange={(e) => update("estimate", Number(e.target.value) as unknown as FormValues["estimate"])}
                />
              </Field>
            </div>

            <Field label="Tags" hint="Comma-separated, up to 8" error={errors.tags}>
              <Input
                value={values.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="backend, security, performance"
              />
            </Field>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="gradient-primary text-white shadow-glow">
              {isEdit ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  error,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      <div className={cn(error && "[&_input]:border-destructive [&_textarea]:border-destructive [&_button]:border-destructive")}>{children}</div>
      {error && <p className="text-[11px] text-destructive font-medium">{error}</p>}
    </div>
  );
}

export interface DeleteTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTaskDialog({ task, open, onOpenChange }: DeleteTaskDialogProps) {
  if (!task) return null;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-mono text-xs">{task.key}</span> · {task.title}
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              deleteTask(task.id);
              toast.success("Task deleted", { description: `${task.key} removed` });
              onOpenChange(false);
            }}
          >
            Delete task
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}