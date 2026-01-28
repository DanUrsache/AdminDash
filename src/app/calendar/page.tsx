"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Task = {
  id: string;
  title: string;
  due_date: string | null;
};

function buildCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
  const totalDays = lastDay.getDate();

  const cells: Array<number | null> = Array.from(
    { length: startOffset },
    () => null
  );
  for (let day = 1; day <= totalDays; day++) {
    cells.push(day);
  }
  return { year, month, cells };
}

export default function CalendarPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const baseDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const { year, month, cells } = buildCalendar(baseDate);
  const monthLabel = new Date(year, month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  const loadTasks = async () => {
    if (!supabase || !session) return;
    const start = new Date(year, month, 1).toISOString().slice(0, 10);
    const end = new Date(year, month + 1, 0).toISOString().slice(0, 10);
    const { data } = await supabase
      .from("tasks")
      .select("id,title,due_date")
      .gte("due_date", start)
      .lte("due_date", end);
    setTasks(data ?? []);
  };

  useEffect(() => {
    if (session) {
      loadTasks();
    }
  }, [session, monthOffset]);

  const taskCountByDay = useMemo(() => {
    const map = new Map<number, number>();
    tasks.forEach((task) => {
      if (!task.due_date) return;
      const day = new Date(task.due_date).getDate();
      map.set(day, (map.get(day) ?? 0) + 1);
    });
    return map;
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Calendar</h1>
          <p className="text-sm text-white/60">Monthly overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonthOffset((v) => v - 1)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            Prev
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            Today
          </button>
          <button
            onClick={() => setMonthOffset((v) => v + 1)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            Next
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 shadow-sm">
        <div className="mb-4 text-lg font-semibold text-white">
          {monthLabel}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/50">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2 text-center">
          {cells.map((day, index) => {
            const isToday = isCurrentMonth && day === today.getDate();
            const taskCount = day ? taskCountByDay.get(day) ?? 0 : 0;
            return (
              <div
                key={`${day ?? "empty"}-${index}`}
                className={`relative h-20 rounded-xl border text-sm flex items-center justify-center ${
                  day
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-transparent border-transparent"
                } ${
                  isToday
                    ? "border-[var(--primary)] bg-[rgba(52,211,153,0.2)] text-white shadow-md"
                    : ""
                }`}
              >
                {day ?? ""}
                {taskCount > 0 && day ? (
                  <span
                    className={`absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[10px] ${
                      isToday ? "bg-white text-black" : "bg-white/20 text-white"
                    }`}
                  >
                    {taskCount}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
