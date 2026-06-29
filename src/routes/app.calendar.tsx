import { createFileRoute } from "@tanstack/react-router";
import { tasks } from "@/data/mock";

export const Route = createFileRoute("/app/calendar")({
  component: () => {
    const days = Array.from({ length: 35 }, (_, i) => i - 3);
    const tasksByDay: Record<number, typeof tasks> = {};
    tasks.forEach((t, i) => { const d = (i * 3) % 28; (tasksByDay[d] ??= []).push(t); });
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">May 2026 · {tasks.length} scheduled items</p>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
          <div className="grid grid-cols-7 bg-muted/40 text-[10px] uppercase font-semibold tracking-widest text-muted-foreground">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className="p-3 text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {days.map((d, i) => (
              <div key={i} className={`min-h-24 border-r border-b border-border p-2 ${d < 1 || d > 31 ? "bg-muted/20 text-muted-foreground" : ""}`}>
                <div className="text-[10px] font-mono mb-1">{d > 0 && d <= 31 ? d : ""}</div>
                <div className="space-y-1">
                  {(tasksByDay[d] || []).slice(0, 2).map(t => (
                    <div key={t.id} className="text-[10px] truncate px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{t.title}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
});