import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, Plus } from "lucide-react";
import { MemberAvatar } from "@/components/shared/Avatar";
import { ProgressBar } from "@/components/shared/Progress";
import { Tag } from "@/components/shared/Badges";
import { useUsers } from "@/hooks";

export const Route = createFileRoute("/admin/teams")({
  head: () => ({ meta: [{ title: "Teams — Admin" }] }),
  component: Teams,
});

function Teams() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading team members...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
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
          <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} members · live data from the API</p>
        </div>
        <button className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2">
          <Plus className="size-3.5" /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {users.map((user) => (
          <div key={user._id} className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all">
            <div className="flex items-start gap-3">
              <MemberAvatar member={{ _id: user._id, name: user.name, avatar: user.avatar }} size={48} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{user.name}</div>
                <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1"><Mail className="size-3" />{user.email}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <Tag tone="primary">{user.role}</Tag>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-muted/60 rounded-md p-2 text-center"><div className="font-mono font-semibold text-sm">{user.role === "admin" ? "Admin" : "Member"}</div><div className="text-muted-foreground text-[10px]">Role</div></div>
              <div className="bg-muted/60 rounded-md p-2 text-center"><div className="font-mono font-semibold text-sm">{new Date(user.createdAt).toLocaleDateString()}</div><div className="text-muted-foreground text-[10px]">Joined</div></div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">Account</span>
                <span className="font-mono font-semibold">{user.email.split("@")[0]}</span>
              </div>
              <ProgressBar value={user.role === "admin" ? 100 : 72} tone={user.role === "admin" ? "success" : "primary"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}