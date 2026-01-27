"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase, hasSupabaseConfig } from "@/lib/supabaseClient";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "✨" },
  { href: "/projects", label: "Projects", icon: "🧩" },
  { href: "/tasks", label: "Tasks", icon: "✅" },
  { href: "/kanban", label: "Kanban", icon: "🧠" },
  { href: "/calendar", label: "Calendar", icon: "🗓️" },
  { href: "/ideas", label: "Ideas", icon: "💡" },
];

export function Sidebar() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-white/70 bg-white/80 px-5 py-6 backdrop-blur">
      <div className="mb-8">
        <div className="text-lg font-semibold text-neutral-900">Nick Assistant</div>
        <div className="text-xs text-neutral-500">Playful Admin Hub</div>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-[0_8px_24px_rgba(108,92,231,0.35)]"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        {session ? (
          <button
            onClick={handleLogout}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="block rounded-xl px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            {hasSupabaseConfig ? "Login" : "Login (configure Supabase)"}
          </Link>
        )}
      </div>
    </aside>
  );
}
