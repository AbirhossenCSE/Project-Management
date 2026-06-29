import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthButton, AuthInput, AuthLayout } from "@/components/mpms/AuthLayout";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "New password — Nexus.io" }] }),
  component: Reset,
});

function Reset() {
  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Use 10+ characters with a mix of letters, numbers, and symbols."
      footer={<><Link to="/login" className="text-primary font-medium hover:underline">← Back to sign in</Link></>}
    >
      <AuthInput label="New password" type="password" placeholder="••••••••••" />
      <AuthInput label="Confirm password" type="password" placeholder="••••••••••" />
      <div className="-mt-2 mb-5">
        <div className="flex gap-1 h-1 mb-1.5">
          <div className="flex-1 rounded-full bg-success" />
          <div className="flex-1 rounded-full bg-success" />
          <div className="flex-1 rounded-full bg-warning" />
          <div className="flex-1 rounded-full bg-muted" />
        </div>
        <div className="text-[10px] text-muted-foreground">Good — add a symbol for stronger</div>
      </div>
      <AuthButton>Update password</AuthButton>
    </AuthLayout>
  );
}