"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type TabEntry = { label: string; url: string };

type Task = {
  id: string;
  title: string;
  due_date: string | null;
  status: string | null;
  actions: string | null;
  tabs: TabEntry[] | string[] | null;
  created_at: string;
};

const statusOptions = ["Backlog", "Open", "In Progress", "Review", "Done"];

export default function TasksPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Open");
  const [actions, setActions] = useState("");
  const [tabs, setTabs] = useState<TabEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editStatus, setEditStatus] = useState("Open");
  const [editActions, setEditActions] = useState("");
  const [editTabs, setEditTabs] = useState<TabEntry[]>([]);
  const [tabsDrafts, setTabsDrafts] = useState<Record<string, TabEntry[]>>({});

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
      setTabsDrafts({});
    } else {
      const rows = data ?? [];
      setTasks(rows);
      const drafts: Record<string, TabEntry[]> = {};
      rows.forEach((task) => {
        drafts[task.id] = normalizeTabs(task.tabs);
      });
      setTabsDrafts(drafts);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      loadTasks();
    }
  }, [session]);

  const makeDefaultLabel = (index: number) => `Tab${index + 1}`;

  const normalizeTabs = (value: Task["tabs"]): TabEntry[] => {
    if (!value) return [];
    if (Array.isArray(value) && value.length && typeof value[0] === "string") {
      return (value as string[]).map((url, idx) => ({
        label: makeDefaultLabel(idx),
        url,
      }));
    }
    return (value as TabEntry[]).filter((tab) => tab.url || tab.label);
  };

  const addTab = () =>
    setTabs((prev) => [...prev, { label: makeDefaultLabel(prev.length), url: "" }]);

  const updateTab = (index: number, field: keyof TabEntry, value: string) =>
    setTabs((prev) =>
      prev.map((tab, idx) => (idx === index ? { ...tab, [field]: value } : tab))
    );

  const removeTab = (index: number) =>
    setTabs((prev) => prev.filter((_, idx) => idx !== index));

  const addEditTab = () =>
    setEditTabs((prev) => [
      ...prev,
      { label: makeDefaultLabel(prev.length), url: "" },
    ]);

  const updateEditTab = (index: number, field: keyof TabEntry, value: string) =>
    setEditTabs((prev) =>
      prev.map((tab, idx) => (idx === index ? { ...tab, [field]: value } : tab))
    );

  const removeEditTab = (index: number) =>
    setEditTabs((prev) => prev.filter((_, idx) => idx !== index));

  const getDraftTabs = (task: Task) =>
    tabsDrafts[task.id] ?? normalizeTabs(task.tabs);

  const updateTaskTab = (
    taskId: string,
    index: number,
    field: keyof TabEntry,
    value: string
  ) =>
    setTabsDrafts((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] ?? []).map((tab, idx) =>
        idx === index ? { ...tab, [field]: value } : tab
      ),
    }));

  const addTaskTab = (taskId: string) =>
    setTabsDrafts((prev) => {
      const current = prev[taskId] ?? [];
      return {
        ...prev,
        [taskId]: [
          ...current,
          { label: makeDefaultLabel(current.length), url: "" },
        ],
      };
    });

  const removeTaskTab = (taskId: string, index: number) =>
    setTabsDrafts((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] ?? []).filter((_, idx) => idx !== index),
    }));

  const saveTaskTabs = async (taskId: string) => {
    if (!supabase || !session) return;
    setSaving(true);
    setError(null);
    const draft = tabsDrafts[taskId] ?? [];
    const tabsList = draft
      .map((tab, idx) => ({
        label: tab.label.trim() || makeDefaultLabel(idx),
        url: tab.url.trim(),
      }))
      .filter((tab) => tab.url);
    const { error } = await supabase
      .from("tasks")
      .update({ tabs: tabsList.length ? tabsList : null })
      .eq("id", taskId);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await loadTasks();
  };

  const handleAdd = async () => {
    if (!supabase || !session || !title.trim()) return;
    setSaving(true);
    setError(null);
    const tabsList = tabs
      .map((tab, idx) => ({
        label: tab.label.trim() || makeDefaultLabel(idx),
        url: tab.url.trim(),
      }))
      .filter((tab) => tab.url);
    const { error } = await supabase.from("tasks").insert({
      user_id: session.user.id,
      title: title.trim(),
      due_date: dueDate || null,
      status,
      actions: actions.trim() || null,
      tabs: tabsList.length ? tabsList : null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTitle("");
    setDueDate("");
    setStatus("Open");
    setActions("");
    setTabs([]);
    await loadTasks();
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.due_date ?? "");
    setEditStatus(task.status ?? "Open");
    setEditActions(task.actions ?? "");
    setEditTabs(normalizeTabs(task.tabs));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDueDate("");
    setEditStatus("Open");
    setEditActions("");
    setEditTabs([]);
  };

  const saveEdit = async (id: string) => {
    if (!supabase || !session || !editTitle.trim()) return;
    setSaving(true);
    setError(null);
    const tabsList = editTabs
      .map((tab, idx) => ({
        label: tab.label.trim() || makeDefaultLabel(idx),
        url: tab.url.trim(),
      }))
      .filter((tab) => tab.url);
    const { error } = await supabase
      .from("tasks")
      .update({
        title: editTitle.trim(),
        due_date: editDueDate || null,
        status: editStatus,
        actions: editActions.trim() || null,
        tabs: tabsList.length ? tabsList : null,
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    cancelEdit();
    await loadTasks();
  };

  const deleteTask = async (id: string) => {
    if (!supabase || !session) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTabsDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await loadTasks();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Tasks</h1>
        <p className="text-sm text-white/60">Your current task list.</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#12131a] p-4">
        <div className="grid gap-3 md:grid-cols-6">
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
          <textarea
            className="min-h-[42px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Actions / next steps"
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            rows={2}
          />
          <div className="space-y-2">
            <div className="text-xs text-white/50">Tabs</div>
            {tabs.length === 0 ? (
              <div className="text-xs text-white/40">No tabs yet.</div>
            ) : (
              tabs.map((tab, idx) => (
                <div key={`${idx}-${tab.url}`} className="flex gap-2">
                  <input
                    className="w-28 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                    placeholder={makeDefaultLabel(idx)}
                    value={tab.label}
                    onChange={(e) => updateTab(idx, "label", e.target.value)}
                  />
                  <input
                    className="flex-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                    placeholder="https://..."
                    value={tab.url}
                    onChange={(e) => updateTab(idx, "url", e.target.value)}
                  />
                  <button
                    onClick={() => removeTab(idx)}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
            <button
              onClick={addTab}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
              type="button"
            >
              + Add tab
            </button>
          </div>
          <select
            className="rounded-md border border-white/10 bg-[#0f1117] px-3 py-2 text-sm text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt} className="bg-[#0f1117] text-white">
                {opt}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-black disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add task"}
          </button>
        </div>
        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
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
              className={`rounded-lg border p-4 text-white/80 ${
                (task.status ?? "Open") === "Done"
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : "border-white/10 bg-[#12131a]"
              }`}
            >
              {editingId === task.id ? (
                <div className="grid gap-3 md:grid-cols-6">
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                  <textarea
                    className="min-h-[42px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    value={editActions}
                    onChange={(e) => setEditActions(e.target.value)}
                    rows={2}
                  />
                  <div className="space-y-2">
                    <div className="text-xs text-white/50">Tabs</div>
                    {editTabs.length === 0 ? (
                      <div className="text-xs text-white/40">No tabs yet.</div>
                    ) : (
                      editTabs.map((tab, idx) => (
                        <div key={`${idx}-${tab.url}`} className="flex gap-2">
                          <input
                            className="w-28 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                            placeholder={makeDefaultLabel(idx)}
                            value={tab.label}
                            onChange={(e) =>
                              updateEditTab(idx, "label", e.target.value)
                            }
                          />
                          <input
                            className="flex-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                            placeholder="https://..."
                            value={tab.url}
                            onChange={(e) =>
                              updateEditTab(idx, "url", e.target.value)
                            }
                          />
                          <button
                            onClick={() => removeEditTab(idx)}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      onClick={addEditTab}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                      type="button"
                    >
                      + Add tab
                    </button>
                  </div>
                  <select
                    className="rounded-md border border-white/10 bg-[#0f1117] px-3 py-2 text-sm text-white"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} className="bg-[#0f1117] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(task.id)}
                      disabled={saving}
                      className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-black disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div
                      className={`text-sm font-medium text-white ${
                        (task.status ?? "Open") === "Done"
                          ? "line-through text-white/60"
                          : ""
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-xs text-white/50">
                      Due: {task.due_date ?? "—"}
                    </div>
                    {task.actions ? (
                      <div className="mt-2 whitespace-pre-wrap text-xs text-white/60">
                        Actions: {task.actions}
                      </div>
                    ) : null}
                    <div className="mt-2 space-y-2 text-xs text-white/60">
                      <div className="mb-1">Tabs:</div>
                      {getDraftTabs(task).length === 0 ? (
                        <div className="text-white/40">No tabs yet.</div>
                      ) : (
                        getDraftTabs(task).map((tab, idx) => (
                          <div key={`${task.id}-${idx}`} className="flex gap-2">
                            <input
                              className="w-28 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                              placeholder={makeDefaultLabel(idx)}
                              value={tab.label}
                              onChange={(e) =>
                                updateTaskTab(task.id, idx, "label", e.target.value)
                              }
                            />
                            <input
                              className="flex-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                              placeholder="https://..."
                              value={tab.url}
                              onChange={(e) =>
                                updateTaskTab(task.id, idx, "url", e.target.value)
                              }
                            />
                            <button
                              onClick={() => removeTaskTab(task.id, idx)}
                              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                              type="button"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addTaskTab(task.id)}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white"
                          type="button"
                        >
                          + Add tab
                        </button>
                        <button
                          onClick={() => saveTaskTabs(task.id)}
                          disabled={saving}
                          className="rounded-md bg-[var(--primary)] px-2 py-1 text-xs text-black disabled:opacity-60"
                          type="button"
                        >
                          Save tabs
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">
                      {task.status ?? "Open"}
                    </span>
                    <button
                      onClick={() => startEdit(task)}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
