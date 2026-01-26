const projects = [
  { name: "City Rooms SEO", status: "Active", owner: "Daniel" },
  { name: "AdminDash", status: "Active", owner: "Nick" },
  { name: "Video Portfolio", status: "Planning", owner: "Daniel" },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-sm text-neutral-500">All active and planned work.</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white">
        <div className="grid grid-cols-3 border-b border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500">
          <div>Project</div>
          <div>Status</div>
          <div>Owner</div>
        </div>
        {projects.map((project) => (
          <div
            key={project.name}
            className="grid grid-cols-3 border-b border-neutral-100 px-4 py-3 text-sm"
          >
            <div>{project.name}</div>
            <div>{project.status}</div>
            <div>{project.owner}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
