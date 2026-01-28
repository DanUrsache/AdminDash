"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type Task = {
  id: string;
  title: string;
  due_date: string | null;
  status: string | null;
  created_at: string;
};

export default function TasksPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
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
      .select("*")
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

  const handleAdd = async () => {
    if (!supabase || !session || !title.trim()) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("tasks").insert({
      user_id: session.user.id,
      title: title.trim(),
      due_date: dueDate || null,
      status: "Open",
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTitle("");
    setDueDate("");
    await loadTasks();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Tasks</h1>
        <p className="text-sm text-white/60">Your current task list.</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#12131a] p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-black disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add task"}
          </button>
        </div>
        {error && (
          <div className="mt-3 text-sm text-red-400">{error}</div>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-white/60">Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="text-sm text-white/60">No tasks yet.</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-[#12131a] p-4 text-white/80"
            >
              <div>
                <div className="text-sm font-medium text-white">{task.title}</div>
                <div className="text-xs text-white/50">
                  Due: {task.due_date ?? "—"}
                </div>
              </div>
              <span className="text-xs text-white/50">{task.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
