import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthButton, AuthInput, AuthLayout } from "@/components/layout/AuthLayout";
import { register } from "@/services/auth.service";

type ApiError = {
  message?: string;
};

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Nexus.io" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
      const response = await register(name || firstName.trim() || lastName.trim(), email, password, "member");
      const role = response.data.user.role;
      await navigate({ to: role === "admin" ? "/admin" : "/app" });
    } catch (err) {
      const message = (err as { response?: { data?: ApiError } })?.response?.data?.message ?? "Failed to create account";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Spin up a new team in under a minute."
      footer={<>Already a member? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <AuthInput label="First name" placeholder="Sarah" value={firstName} onChange={(event) => setFirstName(event.target.value)} disabled={loading} required />
          <AuthInput label="Last name" placeholder="Jenkins" value={lastName} onChange={(event) => setLastName(event.target.value)} disabled={loading} required />
        </div>
        <AuthInput label="Work email" type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} required />
        <AuthInput label="Password" type="password" placeholder="At least 10 characters" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} required />

        <div className="-mt-2 mb-5">
          <div className="flex gap-1 h-1 mb-1.5">
            <div className="flex-1 rounded-full bg-success" />
            <div className="flex-1 rounded-full bg-success" />
            <div className="flex-1 rounded-full bg-success" />
            <div className="flex-1 rounded-full bg-muted" />
          </div>
          <div className="text-[10px] text-muted-foreground">Strong — add a symbol for excellent</div>
        </div>

        <label className="flex items-start gap-2 mb-3 text-xs text-muted-foreground cursor-pointer">
          <input type="checkbox" className="mt-0.5 size-3.5 rounded border-border" defaultChecked disabled={loading} />
          <span>I agree to the <a className="text-primary hover:underline">Terms</a> and <a className="text-primary hover:underline">Privacy Policy</a>.</span>
        </label>
        {error && <p className="mb-3 text-xs font-medium text-destructive">{error}</p>}
        <AuthButton type="submit" disabled={loading}>
          {loading ? "Creating workspace..." : "Create workspace"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
}