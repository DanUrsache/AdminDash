const columns = [
  {
    title: "Backlog",
    items: ["New content ideas", "Landing page variants", "SEO backlink list"],
  },
  {
    title: "In Progress",
    items: ["Dashboard MVP", "GSC report review"],
  },
  {
    title: "Review",
    items: ["City Rooms meta tags", "Calendar layout"],
  },
  {
    title: "Done",
    items: ["Initial research phase"],
  },
];

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Kanban</h1>
        <p className="text-sm text-white/60">Track tasks by stage.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {columns.map((col, idx) => (
          <div
            key={col.title}
            className="rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">{col.title}</div>
              <span
                className={`h-2 w-2 rounded-full ${
                  idx === 0
                    ? "bg-[var(--accent)]"
                    : idx === 1
                    ? "bg-[var(--primary)]"
                    : idx === 2
                    ? "bg-[var(--secondary)]"
                    : "bg-white/30"
                }`}
              />
            </div>
            <div className="mt-3 space-y-2">
              {col.items.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
