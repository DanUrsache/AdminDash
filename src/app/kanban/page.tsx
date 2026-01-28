"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type Task = {
  id: string;
  title: string;
  status: string | null;
};

const columns = [
  "Backlog",
  "Open",
  "In Progress",
  "Review",
  "Done",
];

export default function KanbanPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadTasks = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("tasks")
      .select("id,title,status")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setTasks([]);
    } else {
      setTasks(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      loadTasks();
    }
  }, [session]);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase || !session) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await loadTasks();
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Task[]>();
    columns.forEach((col) => map.set(col, []));
    tasks.forEach((task) => {
      const status = task.status ?? "Open";
      if (!map.has(status)) map.set(status, []);
      map.get(status)?.push(task);
    });
    return map;
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Kanban</h1>
        <p className="text-sm text-white/60">Track tasks by stage.</p>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {loading ? (
        <div className="text-sm text-white/60">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {columns.map((col, idx) => (
            <div
              key={col}
              className="rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{col}</div>
                <span
                  className={`h-2 w-2 rounded-full ${
                    idx === 0
                      ? "bg-[var(--accent)]"
                      : idx === 1
                      ? "bg-[var(--primary)]"
                      : idx === 2
                      ? "bg-[var(--secondary)]"
                      : idx === 3
                      ? "bg-white/50"
                      : "bg-white/30"
                  }`}
                />
              </div>
              <div className="mt-3 space-y-2">
                {(grouped.get(col) ?? []).length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/40">
                    No tasks here.
                  </div>
                ) : (
                  (grouped.get(col) ?? []).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 shadow-sm"
                    >
                      <div className="mb-2 text-sm font-medium text-white">
                        {item.title}
                      </div>
                      <select
                        className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                        value={item.status ?? "Open"}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        disabled={saving}
                      >
                        {columns.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
