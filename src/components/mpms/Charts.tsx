import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 11,
  boxShadow: "var(--shadow-elevated)",
  color: "var(--foreground)",
};

export function ProductivityArea({ data }: { data: { day: string; done: number; opened: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gDone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gOpened" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--primary)", strokeOpacity: 0.2 }} />
        <Area type="monotone" dataKey="opened" stroke="var(--accent-cyan)" strokeWidth={2} fill="url(#gOpened)" />
        <Area type="monotone" dataKey="done" stroke="var(--primary)" strokeWidth={2.5} fill="url(#gDone)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BurndownChart({ data }: { data: { day: string; ideal: number; actual: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="ideal" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
        <Line type="monotone" dataKey="actual" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--primary)" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function VelocityBars({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--primary)", fillOpacity: 0.05 }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--primary)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusPie({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} strokeWidth={0}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function WorkloadHeatmap() {
  const rows = 7;
  const cols = 16;
  const cells = Array.from({ length: rows * cols }, () => Math.random());
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {cells.map((v, i) => (
        <div
          key={i}
          className="aspect-square rounded-sm transition-transform hover:scale-110"
          style={{ background: `color-mix(in oklab, var(--primary) ${Math.round(v * 90) + 5}%, transparent)` }}
          title={`${Math.round(v * 8)}h`}
        />
      ))}
    </div>
  );
}