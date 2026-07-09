import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getUsers, updateUserRole, deleteUser } from "@/services/admin.service";
import { Loader2, ShieldAlert, KeyRound, User, LogOut, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthUser } from "@/components/layout/auth-user-context";

export const Route = createFileRoute("/superadmin")({
  head: () => ({ meta: [{ title: "Super Admin Panel — Nexus.io" }] }),
  component: SuperAdminPanel,
});

function SuperAdminPanel() {
  const { user: loggedInUser } = useAuthUser();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const SA_PASSWORD = import.meta.env.VITE_SA_PASSWORD || "nexus_super_2026";
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    const savedPassword = localStorage.getItem("sa_auth");
    if (savedPassword === SA_PASSWORD) {
      setIsAuthenticated(true);
    }
  }, [SA_PASSWORD]);

  useEffect(() => {
    if (isAuthenticated && hasToken) {
      fetchUsers();
    }
  }, [isAuthenticated, hasToken]);

  async function fetchUsers() {
    setLoading(true);
    setUsersError("");
    try {
      const res = await getUsers();
      if (res.success && res.data?.users) {
        setUsers(res.data.users);
      } else {
        setUsersError("Failed to fetch users: invalid response format");
      }
    } catch (err: any) {
      console.error(err);
      setUsersError(err?.response?.data?.message || "Failed to load users list.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    if (password === SA_PASSWORD) {
      localStorage.setItem("sa_auth", password);
      setIsAuthenticated(true);
    } else {
      setAuthError("Incorrect password");
    }
  }

  function handleLogout() {
    localStorage.removeItem("sa_auth");
    setIsAuthenticated(false);
    setPassword("");
    setUsers([]);
  }

  async function handleRoleChange(userId: string, newRole: "admin" | "member") {
    setUpdatingUserId(userId);
    setSuccessMessage("");
    setUsersError("");
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setSuccessMessage("Role updated successfully!");
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setUsersError("Failed to update user role");
      }
    } catch (err: any) {
      console.error(err);
      setUsersError(err?.response?.data?.message || "Failed to update role.");
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleDeleteUser(userId: string, userName: string) {
    if (userId === loggedInUser?.id) {
      toast.error("Cannot delete yourself");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const res = await deleteUser(userId);
      if (res.success) {
        toast.success("User deleted successfully");
        setUsers(prev => prev.filter(u => u._id !== userId));
      } else {
        toast.error(res.message || "Failed to delete user");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingUserId(null);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-card border border-border p-8 rounded-2xl shadow-soft">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Super Admin Access</h2>
            <p className="mt-2 text-xs text-muted-foreground">Please enter the super admin password to unlock the panel.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 rounded-md px-3 py-2 text-sm outline-none transition-all"
                  placeholder="Super Admin Password"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs font-medium text-destructive bg-destructive/10 p-3 rounded-lg animate-fade-up">
                <AlertCircle className="size-4 shrink-0" />
                {authError}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full gradient-primary text-white py-2 px-4 rounded-md text-sm font-semibold shadow-glow hover:opacity-90 transition-opacity cursor-pointer"
              >
                Unlock Panel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Super Admin Panel</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Workspace Management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            Lock Panel
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">User Accounts & Roles</h2>
              <p className="text-xs text-muted-foreground mt-1">Manage system-wide permissions and roles for all registered users.</p>
            </div>
            
            <div className="flex flex-col items-end gap-1 text-right">
              {successMessage && (
                <div className="flex items-center gap-1.5 text-xs text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg animate-fade-up">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  {successMessage}
                </div>
              )}
              {usersError && (
                <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-lg animate-fade-up">
                  <AlertCircle className="size-3.5 shrink-0" />
                  {usersError}
                </div>
              )}
            </div>
          </div>

          {!hasToken ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-soft animate-fade-up">
              <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
                <div className="size-12 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                  <AlertCircle className="size-6 text-warning" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Authentication Required</h3>
                <p className="text-sm text-muted-foreground">
                  Please log in first to use Super Admin Panel
                </p>
                <Link
                  to="/login"
                  className="mt-2 inline-flex items-center justify-center px-4 py-2 gradient-primary text-white text-xs font-bold rounded-lg shadow-glow hover:opacity-90 transition-opacity"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-soft">
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Info</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((userItem) => (
                        <tr key={userItem._id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {userItem.avatar ? (
                                <img src={userItem.avatar} className="size-8 rounded-full object-cover" alt="" />
                              ) : (
                                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                  {userItem.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-semibold text-foreground">{userItem.name}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-mono">{userItem._id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                            {userItem.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(userItem.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold uppercase tracking-wider",
                              userItem.role === "admin" 
                                ? "bg-purple-500/10 text-purple-600 border border-purple-500/20" 
                                : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            )}>
                              {userItem.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end gap-3 font-medium">
                              {updatingUserId === userItem._id && (
                                <Loader2 className="size-3.5 text-primary animate-spin" />
                              )}
                              <select
                                value={userItem.role}
                                onChange={(e) => handleRoleChange(userItem._id, e.target.value as "admin" | "member")}
                                disabled={updatingUserId !== null || deletingUserId !== null}
                                className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/15 rounded-md px-2 py-1 text-xs outline-none transition-all cursor-pointer font-medium text-foreground disabled:opacity-50"
                              >
                                <option value="member">Member</option>
                                <option value="admin">Administrator</option>
                              </select>
                              <button
                                onClick={() => handleDeleteUser(userItem._id, userItem.name)}
                                disabled={updatingUserId !== null || deletingUserId !== null || userItem._id === loggedInUser?.id}
                                className="text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                                title={userItem._id === loggedInUser?.id ? "Cannot delete yourself" : `Delete ${userItem.name}`}
                              >
                                {deletingUserId === userItem._id ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="size-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
