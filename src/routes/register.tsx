import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthButton, AuthInput, AuthLayout } from "@/components/layout/AuthLayout";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Nexus.io" }] }),
  component: Register,
});

function Register() {
  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Spin up a new team in under a minute."
      footer={<>Already a member? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></>}
    >
      <div className="grid grid-cols-2 gap-3">
        <AuthInput label="First name" placeholder="Sarah" />
        <AuthInput label="Last name" placeholder="Jenkins" />
      </div>
      <AuthInput label="Work email" type="email" placeholder="you@company.com" />
      <AuthInput label="Password" type="password" placeholder="At least 10 characters" />

      <div className="-mt-2 mb-5">
        <div className="flex gap-1 h-1 mb-1.5">
          <div className="flex-1 rounded-full bg-success" />
          <div className="flex-1 rounded-full bg-success" />
          <div className="flex-1 rounded-full bg-success" />
          <div className="flex-1 rounded-full bg-muted" />
        </div>
        <div className="text-[10px] text-muted-foreground">Strong — add a symbol for excellent</div>
      </div>

      <label className="flex items-start gap-2 mb-5 text-xs text-muted-foreground cursor-pointer">
        <input type="checkbox" className="mt-0.5 size-3.5 rounded border-border" defaultChecked />
        <span>I agree to the <a className="text-primary hover:underline">Terms</a> and <a className="text-primary hover:underline">Privacy Policy</a>.</span>
      </label>
      <AuthButton>Create workspace</AuthButton>
    </AuthLayout>
  );
}