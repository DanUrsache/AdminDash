import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
  { href: "/kanban", label: "Kanban" },
  { href: "/calendar", label: "Calendar" },
  { href: "/ideas", label: "Ideas" },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white px-4 py-6">
      <div className="mb-8">
        <div className="text-lg font-semibold">Nick Assistant</div>
        <div className="text-xs text-neutral-500">Personal Dashboard</div>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6">
        <Link
          href="/login"
          className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
        >
          Login
        </Link>
      </div>
    </aside>
  );
}
