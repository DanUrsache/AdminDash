const tasks = [
  { title: "Add SSR meta tags", due: "Tomorrow" },
  { title: "Prepare Kanban columns", due: "Friday" },
  { title: "Collect video samples", due: "Next week" },
];

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm text-neutral-500">Your current task list.</p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div>
              <div className="text-sm font-medium">{task.title}</div>
              <div className="text-xs text-neutral-500">Due: {task.due}</div>
            </div>
            <button className="text-xs text-neutral-500 hover:text-neutral-700">
              Mark done
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
