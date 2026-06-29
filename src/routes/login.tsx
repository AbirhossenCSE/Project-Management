import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthButton, AuthInput, AuthLayout } from "@/components/layout/AuthLayout";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Nexus.io" }] }),
  component: Login,
});

function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your workspace to continue."
      footer={<>Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link></>}
    >
      <div className="space-y-2 mb-5">
        <AuthButton variant="outline">
          <span className="size-4 rounded-full bg-foreground/80" /> Continue with Google
        </AuthButton>
        <AuthButton variant="outline">
          <span className="size-4 rounded-sm bg-foreground/80" /> Continue with GitHub
        </AuthButton>
      </div>
      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <span className="relative bg-background px-2 text-[10px] uppercase tracking-widest text-muted-foreground">or with email</span>
      </div>
      <AuthInput label="Email" type="email" placeholder="you@company.com" />
      <AuthInput
        label="Password"
        type="password"
        placeholder="••••••••"
        right={<Link to="/forgot-password" className="text-[11px] text-primary hover:underline">Forgot?</Link>}
      />
      <label className="flex items-center gap-2 mb-5 text-xs text-muted-foreground cursor-pointer">
        <input type="checkbox" className="size-3.5 rounded border-border" defaultChecked />
        Keep me signed in for 30 days
      </label>
      <AuthButton>Sign in</AuthButton>
    </AuthLayout>
  );
}