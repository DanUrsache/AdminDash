"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type Task = { status: string | null; due_date: string | null };

type Project = { status: string | null };

type Idea = { id: string };

function getWeekRange(date: Date) {
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [ideaCount, setIdeaCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadStats = async () => {
    if (!supabase || !session) return;
    setLoading(true);
    setError(null);
    const { monday, sunday } = getWeekRange(new Date());
    const start = monday.toISOString().slice(0, 10);
    const end = sunday.toISOString().slice(0, 10);

    const [tasksRes, projectsRes, ideasRes, weekRes] = await Promise.all([
      supabase.from("tasks").select("status", { count: "exact" }),
      supabase.from("projects").select("status", { count: "exact" }),
      supabase.from("ideas").select("id", { count: "exact" }),
      supabase
        .from("tasks")
        .select("due_date", { count: "exact" })
        .gte("due_date", start)
        .lte("due_date", end),
    ]);

    if (tasksRes.error || projectsRes.error || ideasRes.error || weekRes.error) {
      setError(
        tasksRes.error?.message ||
          projectsRes.error?.message ||
          ideasRes.error?.message ||
          weekRes.error?.message ||
          "Unknown error"
      );
      setLoading(false);
      return;
    }

    const taskRows = tasksRes.data as Array<{ status: string | null }> | null;
    const projectRows =
      projectsRes.data as Array<{ status: string | null }> | null;

    const openTasks =
      taskRows?.filter((t) => (t.status ?? "Open") === "Open").length ?? 0;
    const activeProjects =
      projectRows?.filter((p) => (p.status ?? "Active") === "Active")
        .length ?? 0;

    setTaskCount(openTasks);
    setProjectCount(activeProjects);
    setIdeaCount(ideasRes.count ?? 0);
    setWeekCount(weekRes.count ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      loadStats();
    }
  }, [session]);

  const stats = useMemo(
    () => [
      { label: "Active Projects", value: loading ? "…" : String(projectCount) },
      { label: "Open Tasks", value: loading ? "…" : String(taskCount) },
      { label: "Ideas Backlog", value: loading ? "…" : String(ideaCount) },
      {
        label: "This Week",
        value: loading ? "…" : `${weekCount} deadlines`,
      },
    ],
    [loading, projectCount, taskCount, ideaCount, weekCount]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/60">
          A builder‑style overview of projects, tasks, and ideas.
        </p>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={`rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="text-xs text-white/60">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {item.value}
            </div>
            <div
              className={`mt-3 h-1.5 rounded-full ${
                index === 0
                  ? "bg-[var(--primary)]"
                  : index === 1
                  ? "bg-[var(--secondary)]"
                  : index === 2
                  ? "bg-[var(--accent)]"
                  : "bg-white/20"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-white">Next Actions</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>Review the open tasks list</li>
            <li>Move projects out of Planning</li>
            <li>Turn top ideas into tasks</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-white">Recent Updates</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>Dashboard stats are now live</li>
            <li>Projects & Ideas support CRUD</li>
            <li>Kanban is tied to tasks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
