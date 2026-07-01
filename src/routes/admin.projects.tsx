import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutGrid, List, Plus, Search, Filter, Calendar, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { ProgressBar } from "@/components/shared/Progress";
import { StatusBadge } from "@/components/shared/Badges";
import { AvatarGroup } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks";
import { createProject, deleteProject } from "@/services/project.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 as Spinner } from "lucide-react";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — Admin" }] }),
  component: Projects,
});

function Projects() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const { projects, loading, error, refetch } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreateProject() {
    if (!projectName.trim() || !projectDescription.trim()) {
      setFormError("Name and description are required");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await createProject(projectName.trim(), projectDescription.trim());
      await refetch();
      toast.success("Project created");
      setCreateOpen(false);
      setProjectName("");
      setProjectDescription("");
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create project";
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

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading projects...
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
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projects · live data from the API</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2">
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
          {projects.map((p) => (
            <div key={p._id} className="group bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between mb-4">
                <Link to="/admin/projects/$projectId" params={{ projectId: p._id }} className="size-10 rounded-xl grid place-items-center text-white text-xs font-bold bg-primary">
                  {p.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </Link>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <button
                    onClick={() => void handleDeleteProject(p._id, p.name)}
                    disabled={deletingId === p._id}
                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <Link to="/admin/projects/$projectId" params={{ projectId: p._id }}>
              <h3 className="font-semibold leading-snug mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>Members</span><span className="font-mono font-semibold text-foreground">{p.members.length + 1}</span>
              </div>
              <ProgressBar value={p.status === "completed" ? 100 : p.status === "active" ? 66 : 33} tone={p.status === "on-hold" ? "warning" : p.status === "completed" ? "success" : "primary"} className="mb-4" />
              <div className="flex items-center justify-between">
                <AvatarGroup members={[p.owner, ...p.members]} size={22} />
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{new Date(p.createdAt).toLocaleDateString()}</span>
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
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-muted/40 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5">
                    <Link to="/admin/projects/$projectId" params={{ projectId: p._id }} className="flex items-center gap-3">
                      <div className="size-8 rounded-lg grid place-items-center text-white text-[10px] font-bold bg-primary">
                        {p.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{p.owner.name}</td>
                  <td className="px-5 py-3.5"><div className="w-28"><ProgressBar value={p.status === "completed" ? 100 : p.status === "active" ? 66 : 33} /></div></td>
                  <td className="px-5 py-3.5"><AvatarGroup members={[p.owner, ...p.members]} size={22} /></td>
                  <td className="px-5 py-3.5 font-mono text-xs">{p.members.length + 1} members</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteProject(p._id, p.name);
                      }}
                      disabled={deletingId === p._id}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>Add a new project to the live API-backed list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {formError && <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{formError}</div>}
            <div className="space-y-2">
              <label className="text-xs font-semibold">Name</label>
              <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Description</label>
              <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Project description" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => setCreateOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="button" onClick={() => void handleCreateProject()} disabled={submitting} className="gradient-primary text-white shadow-glow">
              {submitting ? <Spinner className="mr-2 size-4 animate-spin" /> : null}
              {submitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}