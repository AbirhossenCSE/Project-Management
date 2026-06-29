import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthButton, AuthInput, AuthLayout } from "@/components/mpms/AuthLayout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Nexus.io" }] }),
  component: Forgot,
});

function Forgot() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send a magic link to your inbox."
      footer={<><Link to="/login" className="text-primary font-medium hover:underline">← Back to sign in</Link></>}
    >
      <AuthInput label="Work email" type="email" placeholder="you@company.com" />
      <AuthButton>Send reset link</AuthButton>
      <div className="mt-6 bg-muted/60 border border-border rounded-lg p-3 text-xs text-muted-foreground">
        Tip: Reset links expire after 30 minutes for security.
      </div>
    </AuthLayout>
  );
}