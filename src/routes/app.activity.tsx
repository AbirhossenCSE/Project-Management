import { createFileRoute } from "@tanstack/react-router";
import { activities } from "@/data/mock";
import { MemberAvatar } from "@/components/mpms/Avatar";

export const Route = createFileRoute("/app/activity")({
  component: () => (
    <div className="p-6 sm:p-8 space-y-6 max-w-[900px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Everything happening across your projects</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
        <div className="space-y-5 border-l-2 border-border pl-5 ml-2">
          {[...activities, ...activities].map((a, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[26px] top-1 size-3 rounded-full gradient-primary ring-4 ring-card" />
              <div className="flex items-start gap-3">
                <MemberAvatar id={`m${(i % 7) + 1}`} size={28} />
                <div className="flex-1 text-sm">
                  <span className="font-medium">{a.user}</span>
                  <span className="text-muted-foreground"> {a.action} </span>
                  <span className="font-medium text-primary">{a.target}</span>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{a.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});