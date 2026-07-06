import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthButton, AuthInput, AuthLayout } from "@/components/layout/AuthLayout";
import { login } from "@/services/auth.service";

type ApiError = {
  message?: string;
};

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Nexus.io" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);
      const role = response.data.user.role;
      await navigate({ to: role === "admin" ? "/admin" : "/app" });
    } catch (err) {
      const message = (err as { response?: { data?: ApiError } })?.response?.data?.message ?? "Failed to sign in";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title=""
      subtitle=""
      footer={<>Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link></>}
    >
      <div className="mb-6 space-y-2 animate-fade-up">
        <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          Project Management
        </span>
        <h1 className="text-2xl font-semibold tracking-tight mt-3">Welcome back</h1>
        <p className="text-xs text-muted-foreground">Sign in to your workspace to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          required
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          right={<Link to="/login" className="text-[11px] text-primary hover:underline">Forgot?</Link>}
          disabled={loading}
          required
        />
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none py-1">
          <input type="checkbox" className="size-3.5 rounded border-border" defaultChecked disabled={loading} />
          Keep me signed in for 30 days
        </label>
        {error && <p className="text-xs font-medium text-destructive animate-fade-up">{error}</p>}
        <AuthButton type="submit" disabled={loading} className="mt-2">
          {loading ? "Signing in..." : "Sign in"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}