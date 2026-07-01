import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@/components/shared/Progress";
import { StatusBadge } from "@/components/shared/Badges";
import { AvatarGroup } from "@/components/shared/Avatar";
import { getMe } from "@/services/auth.service";
import { useProjects } from "@/hooks";

export const Route = createFileRoute("/app/projects")({
    component: Projects,
});

function Projects() {
    const { projects, loading, error } = useProjects();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        void getMe().then((response) => {
            if (!mounted) return;
            setCurrentUserId(response.data.user.id);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const mine = useMemo(
        () => projects.filter((project) => project.owner._id === currentUserId || project.members.some((member) => member._id === currentUserId)),
        [projects, currentUserId],
    );

    if (loading || !currentUserId) {
        return (
            <div className="p-6 sm:p-8 space-y-6 max-w-[1500px] mx-auto flex min-h-[50vh] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" /> Loading projects...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 sm:p-8 space-y-6 max-w-[1500px] mx-auto">
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 space-y-6 max-w-[1500px] mx-auto">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">My Projects</h1>
                <p className="text-sm text-muted-foreground mt-1">Projects you're contributing to</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {mine.map((project) => (
                    <Link key={project._id} to="/admin/projects/$projectId" params={{ projectId: project._id }} className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className="size-10 rounded-xl grid place-items-center text-white text-xs font-bold bg-primary">
                                {project.name.split(" ").slice(0, 2).map((word) => word[0]).join("")}
                            </div>
                            <StatusBadge status={project.status} />
                        </div>
                        <div className="font-semibold mb-1">{project.name}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                        <ProgressBar value={project.status === "completed" ? 100 : project.status === "active" ? 66 : 33} className="mb-3" />
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <AvatarGroup members={[project.owner, ...project.members]} size={22} />
                            <span className="font-mono">{project.members.length + 1} members</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}