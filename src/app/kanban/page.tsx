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
        <h1 className="text-2xl font-semibold">Kanban</h1>
        <p className="text-sm text-neutral-500">Track tasks by stage.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {columns.map((col) => (
          <div
            key={col.title}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="text-sm font-semibold">{col.title}</div>
            <div className="mt-3 space-y-2">
              {col.items.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-neutral-200 bg-neutral-50 p-2 text-sm"
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
