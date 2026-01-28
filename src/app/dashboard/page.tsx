const stats = [
  { label: "Active Projects", value: "3" },
  { label: "Open Tasks", value: "24" },
  { label: "Ideas Backlog", value: "12" },
  { label: "This Week", value: "5 deadlines" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/60">
          A builder‑style overview of projects, tasks, and ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={`rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="text-xs text-white/60">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {item.value}
            </div>
            <div
              className={`mt-3 h-1.5 rounded-full ${
                index === 0
                  ? "bg-[var(--primary)]"
                  : index === 1
                  ? "bg-[var(--secondary)]"
                  : index === 2
                  ? "bg-[var(--accent)]"
                  : "bg-white/20"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-white">Next Actions</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>Finalize copy for City Rooms homepage</li>
            <li>Prepare Kanban taxonomy for Q1</li>
            <li>Review new project ideas</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-white">Recent Updates</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>SEO audit completed for cityroomsighet.ro</li>
            <li>GSC metrics imported (last 3 months)</li>
            <li>Drafted dashboard layout</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
