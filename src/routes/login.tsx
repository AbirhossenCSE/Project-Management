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
      title="Welcome back"
      subtitle="Sign in to your workspace to continue."
      footer={<>Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link></>}
    >
      <div className="space-y-2 mb-5">
        <AuthButton variant="outline" type="button" disabled={loading}>
          <span className="size-4 rounded-full bg-foreground/80" /> Continue with Google
        </AuthButton>
        <AuthButton variant="outline" type="button" disabled={loading}>
          <span className="size-4 rounded-sm bg-foreground/80" /> Continue with GitHub
        </AuthButton>
      </div>
      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <span className="relative bg-background px-2 text-[10px] uppercase tracking-widest text-muted-foreground">or with email</span>
      </div>
      <form onSubmit={handleSubmit}>
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
          right={<Link to="/forgot-password" className="text-[11px] text-primary hover:underline">Forgot?</Link>}
          disabled={loading}
          required
        />
        <label className="flex items-center gap-2 mb-3 text-xs text-muted-foreground cursor-pointer">
          <input type="checkbox" className="size-3.5 rounded border-border" defaultChecked disabled={loading} />
          Keep me signed in for 30 days
        </label>
        {error && <p className="mb-3 text-xs font-medium text-destructive">{error}</p>}
        <AuthButton type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}