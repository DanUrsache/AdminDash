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
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    setTasks(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      loadTasks();
    }
  }, [session]);

  const handleAdd = async () => {
    if (!supabase || !session || !title.trim()) return;
    await supabase.from("tasks").insert({
      user_id: session.user.id,
      title: title.trim(),
      due_date: dueDate || null,
      status: "Open",
    });
    setTitle("");
    setDueDate("");
    await loadTasks();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm text-neutral-500">Your current task list.</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm text-white"
          >
            Add task
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-neutral-500">Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="text-sm text-neutral-500">No tasks yet.</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4"
            >
              <div>
                <div className="text-sm font-medium">{task.title}</div>
                <div className="text-xs text-neutral-500">
                  Due: {task.due_date ?? "—"}
                </div>
              </div>
              <span className="text-xs text-neutral-500">{task.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
