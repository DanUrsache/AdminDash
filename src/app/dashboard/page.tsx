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
        <h1 className="text-3xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500">
          A playful, focused overview of projects, tasks, and ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={`rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="text-xs text-neutral-500">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold text-neutral-900">
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
                  : "bg-neutral-200"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">Next Actions</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>Finalize copy for City Rooms homepage</li>
            <li>Prepare Kanban taxonomy for Q1</li>
            <li>Review new project ideas</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Updates</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>SEO audit completed for cityroomsighet.ro</li>
            <li>GSC metrics imported (last 3 months)</li>
            <li>Drafted dashboard layout</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
