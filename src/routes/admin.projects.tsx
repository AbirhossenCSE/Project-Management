import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Check, ChevronDown, Edit2, Filter, LayoutGrid, List, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ProgressBar } from "@/components/shared/Progress";
import { StatusBadge } from "@/components/shared/Badges";
import { AvatarGroup, MemberAvatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import { useProjects, useUsers } from "@/hooks";
import { ProjectGridSkeleton } from "@/components/shared/Skeleton";
import type { ProjectItem } from "@/hooks/useProjects";
import { createProject, deleteProject, updateProject, type ProjectPayload, type ProjectStatus } from "@/services/project.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — Admin" }] }),
  component: Projects,
});

type ProjectFormState = {
  name: string;
  description: string;
  status: ProjectStatus;
  members: string[];
};

const EMPTY_FORM: ProjectFormState = {
  name: "",
  description: "",
  status: "active",
  members: [],
};

function Projects() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const { projects, loading, error, refetch } = useProjects();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [form, setForm] = useState<ProjectFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);

  const loadingState = loading || usersLoading;

  const selectedMembers = useMemo(
    () => users.filter((user) => form.members.includes(user._id)),
    [form.members, users],
  );

  function openCreate() {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setCreateOpen(true);
  }

  function openEdit(project: ProjectItem) {
    setEditingProject(project);
    setForm({
      name: project.name,
      description: project.description,
      status: project.status,
      members: project.members.map((member) => member._id),
    });
    setFormError(null);
    setCreateOpen(true);
  }

  function closeDialog() {
    setCreateOpen(false);
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setMembersOpen(false);
  }

  function toggleMember(memberId: string) {
    setForm((current) => ({
      ...current,
      members: current.members.includes(memberId)
        ? current.members.filter((id) => id !== memberId)
        : [...current.members, memberId],
    }));
  }

  async function handleSaveProject() {
    if (!form.name.trim() || !form.description.trim()) {
      setFormError("Name and description are required");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const payload: ProjectPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        members: form.members,
      };

      if (editingProject) {
        await updateProject(editingProject._id, payload);
        toast.success("Project updated");
      } else {
        await createProject(payload);
        toast.success("Project created");
      }

      await refetch();
      closeDialog();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? `Failed to ${editingProject ? "update" : "create"} project`;
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProject(projectId: string, projectName: string) {
    if (!window.confirm(`Delete project \"${projectName}\"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
      await refetch();
      toast.success("Project deleted");
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to delete project";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loadingState) {
    return <ProjectGridSkeleton />;
  }

  if (error || usersError) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error ?? usersError}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projects · live data from the API</p>
        </div>
        <button onClick={openCreate} className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2">
          <Plus className="size-3.5" /> Create Project
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-xl p-2 shadow-soft">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input placeholder="Search projects..." className="w-full bg-transparent pl-9 pr-3 py-1.5 text-xs outline-none" />
        </div>
        <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-muted">
          <Filter className="size-3.5" /> Status
        </button>
        <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-muted">
          <Filter className="size-3.5" /> Client
        </button>
        <div className="bg-muted rounded-md p-0.5 flex">
          <button onClick={() => setView("grid")} className={cn("p-1.5 rounded", view === "grid" ? "bg-card shadow-soft text-primary" : "text-muted-foreground")}>
            <LayoutGrid className="size-3.5" />
          </button>
          <button onClick={() => setView("table")} className={cn("p-1.5 rounded", view === "table" ? "bg-card shadow-soft text-primary" : "text-muted-foreground")}>
            <List className="size-3.5" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project._id} className="group bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between mb-4">
                <Link to="/admin/projects/$projectId" params={{ projectId: project._id }} className="size-10 rounded-xl grid place-items-center text-white text-xs font-bold bg-primary">
                  {project.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </Link>
                <div className="flex items-center gap-2">
                  <StatusBadge status={project.status} />
                  <button
                    onClick={() => openEdit(project)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Edit ${project.name}`}
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => void handleDeleteProject(project._id, project.name)}
                    disabled={deletingId === project._id}
                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Delete ${project.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <Link to="/admin/projects/$projectId" params={{ projectId: project._id }}>
                <h3 className="font-semibold leading-snug mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Members</span><span className="font-mono font-semibold text-foreground">{project.members.length + 1}</span>
                </div>
                <ProgressBar value={project.status === "completed" ? 100 : project.status === "active" ? 66 : 33} tone={project.status === "on-hold" ? "warning" : project.status === "completed" ? "success" : "primary"} className="mb-4" />
                <div className="flex items-center justify-between">
                  <AvatarGroup members={[project.owner, ...project.members]} size={22} />
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Project</th>
                <th className="text-left px-5 py-3 font-semibold">Client</th>
                <th className="text-left px-5 py-3 font-semibold">Progress</th>
                <th className="text-left px-5 py-3 font-semibold">Team</th>
                <th className="text-left px-5 py-3 font-semibold">Budget</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-right px-5 py-3 font-semibold">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-muted/40 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5">
                    <Link to="/admin/projects/$projectId" params={{ projectId: project._id }} className="flex items-center gap-3">
                      <div className="size-8 rounded-lg grid place-items-center text-white text-[10px] font-bold bg-primary">
                        {project.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                      <span className="font-medium">{project.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{project.owner.name}</td>
                  <td className="px-5 py-3.5"><div className="w-28"><ProgressBar value={project.status === "completed" ? 100 : project.status === "active" ? 66 : 33} /></div></td>
                  <td className="px-5 py-3.5"><AvatarGroup members={[project.owner, ...project.members]} size={22} /></td>
                  <td className="px-5 py-3.5 font-mono text-xs">{project.members.length + 1} members</td>
                  <td className="px-5 py-3.5"><StatusBadge status={project.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(project);
                      }}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors mr-1"
                      aria-label={`Edit ${project.name}`}
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteProject(project._id, project.name);
                      }}
                      disabled={deletingId === project._id}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Delete ${project.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit project" : "Create project"}</DialogTitle>
            <DialogDescription>{editingProject ? "Update the project details and team members." : "Add a new project to the live API-backed list."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {formError && <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{formError}</div>}
            <div className="space-y-2">
              <label className="text-xs font-semibold">Name</label>
              <Input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} placeholder="Project name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} placeholder="Project description" rows={4} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(["active", "completed", "on-hold"] as ProjectStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, status }))}
                    className={cn(
                      "rounded-md border px-3 py-2 text-xs font-medium capitalize transition-colors",
                      form.status === status ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold">Members</label>
                <span className="text-[10px] text-muted-foreground">{selectedMembers.length} selected</span>
              </div>
              <Popover open={membersOpen} onOpenChange={setMembersOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-between">
                    <span className="truncate">
                      {selectedMembers.length > 0 ? selectedMembers.map((member) => member.name).join(", ") : "Select team members"}
                    </span>
                    <ChevronDown className="size-4 shrink-0 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {users.map((user) => {
                      const checked = form.members.includes(user._id);
                      return (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => toggleMember(user._id)}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
                        >
                          <Checkbox checked={checked} />
                          <MemberAvatar member={user} size={28} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{user.name}</div>
                            <div className="truncate text-[11px] text-muted-foreground">{user.email} · {user.role}</div>
                          </div>
                          {checked && <Check className="size-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={closeDialog} disabled={submitting}>Cancel</Button>
            <Button type="button" onClick={() => void handleSaveProject()} disabled={submitting} className="gradient-primary text-white shadow-glow">
              {submitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {submitting ? (editingProject ? "Saving..." : "Creating...") : (editingProject ? "Save changes" : "Create Project")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}