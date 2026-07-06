import { useState, type FormEvent, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthButton, AuthInput, AuthLayout } from "@/components/layout/AuthLayout";
import { register } from "@/services/auth.service";
import { cn } from "@/lib/utils";

type ApiError = {
  message?: string;
};

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Nexus.io" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return { label: "", color: "bg-muted", text: "text-muted-foreground", width: "w-0" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { label: "Weak — write a longer password", color: "bg-destructive", text: "text-destructive", width: "w-1/3" };
    } else if (score <= 4) {
      return { label: "Medium — add symbols & numbers", color: "bg-warning", text: "text-warning-foreground", width: "w-2/3" };
    } else {
      return { label: "Strong — excellent complexity", color: "bg-success", text: "text-success", width: "w-full" };
    }
  }, [password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await register(fullName.trim(), email, password, role);
      const userRole = response.data.user.role;
      await navigate({ to: userRole === "admin" ? "/admin" : "/app" });
    } catch (err) {
      const message = (err as { response?: { data?: ApiError } })?.response?.data?.message ?? "Failed to create account";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title=""
      subtitle=""
      footer={<>Already a member? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></>}
    >
      <div className="mb-6 space-y-2 animate-fade-up">
        <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          Project Management
        </span>
        <h1 className="text-2xl font-semibold tracking-tight mt-3">Create your workspace</h1>
        <p className="text-xs text-muted-foreground">Spin up a new team in under a minute.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
        <AuthInput
          label="Full name"
          placeholder="Sarah Jenkins"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          disabled={loading}
          required
        />
        <AuthInput
          label="Work email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthInput
            label="Password"
            type="password"
            placeholder="At least 8 chars"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
          />
          <AuthInput
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={loading}
            required
          />
        </div>

        {password && (
          <div className="mb-4 animate-fade-up">
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden mb-1.5">
              <div className={cn("h-full transition-all duration-300", passwordStrength.color, passwordStrength.width)} />
            </div>
            <span className={cn("text-[10px] font-medium", passwordStrength.text)}>
              {passwordStrength.label}
            </span>
          </div>
        )}

        <div className="mb-4">
          <span className="block text-xs font-medium text-foreground mb-1.5">Your Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="w-full bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 rounded-md px-3 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            disabled={loading}
          >
            <option value="member">Member (view & update assigned tasks)</option>
            <option value="admin">Administrator (full dashboard planning & setups)</option>
          </select>
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer select-none py-1">
          <input type="checkbox" className="mt-0.5 size-3.5 rounded border-border" defaultChecked disabled={loading} />
          <span>I agree to the <a className="text-primary hover:underline">Terms</a> and <a className="text-primary hover:underline">Privacy Policy</a>.</span>
        </label>

        {error && <p className="text-xs font-medium text-destructive animate-fade-up">{error}</p>}

        <AuthButton type="submit" disabled={loading} className="mt-2">
          {loading ? "Creating workspace..." : "Create workspace"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}