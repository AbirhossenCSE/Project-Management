import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { ProductivityArea, StatusPie, VelocityBars, WorkloadHeatmap } from "@/components/shared/Charts";
import { productivitySeries, members, sprints } from "@/data/mock";
import { ProgressBar } from "@/components/shared/Progress";
import { MemberAvatar } from "@/components/shared/Avatar";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Admin" }] }),
  component: Reports,
});

function Reports() {
  const pieData = [
    { name: "Done", value: 184, color: "var(--success)" },
    { name: "In Progress", value: 62, color: "var(--primary)" },
    { name: "Review", value: 28, color: "var(--accent-cyan)" },
    { name: "To Do", value: 94, color: "var(--muted-foreground)" },
  ];
  const velocity = sprints.filter(s => s.status !== "planned").map(s => ({ name: s.name.split("—")[0].trim(), value: s.velocity }));

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep visibility into delivery, capacity, and quality.</p>
        </div>
        <button className="bg-card border border-border px-3 py-2 rounded-md text-xs font-medium inline-flex items-center gap-2 hover:bg-muted">
          <Download className="size-3.5" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "On-time Delivery", value: "92%", delta: "+4%" },
          { label: "Avg Cycle Time", value: "3.4d", delta: "−0.6d" },
          { label: "Bug Escape Rate", value: "1.8%", delta: "−0.3%" },
          { label: "Capacity Utilization", value: "87%", delta: "+5%" },
        ].map((k) => (
          <div key={k.label} className="bg-card border border-border rounded-2xl p-5 shadow-soft">
            <div className="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground">{k.label}</div>
            <div className="text-2xl font-semibold font-mono mt-1">{k.value}</div>
            <div className="text-[11px] text-success font-medium mt-1">{k.delta} vs prev</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Productivity Trend</h2>
          <ProductivityArea data={productivitySeries} />
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Task Distribution</h2>
          <StatusPie data={pieData} />
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-mono font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Sprint Velocity</h2>
          <VelocityBars data={velocity} />
        </div>
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Workload Heatmap</h2>
            <span className="text-[11px] text-muted-foreground">Hours per day · last 16 days</span>
          </div>
          <WorkloadHeatmap />
          <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-0.5">
              {[10, 30, 50, 70, 90].map(v => <div key={v} className="size-3 rounded-sm" style={{ background: `color-mix(in oklab, var(--primary) ${v}%, transparent)` }} />)}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h2 className="text-sm font-semibold mb-4">Team Productivity Ranking</h2>
        <div className="space-y-3">
          {[...members].sort((a, b) => b.productivity - a.productivity).slice(0, 6).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-muted grid place-items-center text-[10px] font-bold font-mono">{i + 1}</div>
              <MemberAvatar id={m.id} size={28} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{m.name}</div>
                <div className="text-[10px] text-muted-foreground">{m.role} · {m.department}</div>
              </div>
              <div className="w-40"><ProgressBar value={m.productivity} tone={m.productivity > 85 ? "success" : "primary"} /></div>
              <span className="font-mono font-semibold text-sm w-10 text-right">{m.productivity}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}