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
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-500">
          Overview of projects, tasks, and ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="text-xs text-neutral-500">{item.label}</div>
            <div className="mt-2 text-xl font-semibold">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="text-sm font-semibold">Next Actions</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>Finalize copy for City Rooms homepage</li>
            <li>Prepare Kanban taxonomy for Q1</li>
            <li>Review new project ideas</li>
          </ul>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="text-sm font-semibold">Recent Updates</h2>
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
