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
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f1014]/90 px-4 py-3 shadow-sm">
        <div>
          <div className="text-sm font-semibold text-white">Nick Assistant</div>
          <div className="text-xs text-white/60">Builder‑style Admin Hub</div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="absolute right-4 top-4 w-72 rounded-2xl border border-white/10 bg-[#111218] p-4 text-white shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Navigation</div>
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-white/60"
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
                  className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5"
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
