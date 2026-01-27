"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
  { href: "/kanban", label: "Kanban" },
  { href: "/calendar", label: "Calendar" },
  { href: "/ideas", label: "Ideas" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
        <div>
          <div className="text-sm font-semibold text-neutral-900">Nick Assistant</div>
          <div className="text-xs text-neutral-500">Playful Admin Hub</div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-4 top-4 w-72 rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Navigation</div>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-neutral-500"
              >
                Close
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
