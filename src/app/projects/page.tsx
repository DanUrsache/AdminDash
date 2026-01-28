"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  created_at: string;
};

const statusOptions = ["Active", "Planning", "Paused", "Done"];

export default function ProjectsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadProjects = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setProjects([]);
    } else {
      setProjects(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      loadProjects();
    }
  }, [session]);

  const handleAdd = async () => {
    if (!supabase || !session || !name.trim()) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("projects").insert({
      user_id: session.user.id,
      name: name.trim(),
      description: description.trim() || null,
      status,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setName("");
    setDescription("");
    setStatus("Active");
    await loadProjects();
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDescription(project.description ?? "");
    setEditStatus(project.status ?? "Active");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditStatus("Active");
  };

  const saveEdit = async (id: string) => {
    if (!supabase || !session || !editName.trim()) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("projects")
      .update({
        name: editName.trim(),
        description: editDescription.trim() || null,
        status: editStatus,
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    cancelEdit();
    await loadProjects();
  };

  const deleteProject = async (id: string) => {
    if (!supabase || !session) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await loadProjects();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <p className="text-sm text-white/60">All active and planned work.</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#12131a] p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-black disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add project"}
          </button>
        </div>
        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-white/60">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="text-sm text-white/60">No projects yet.</div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-white/10 bg-[#12131a] p-4 text-white/80"
            >
              {editingId === project.id ? (
                <div className="grid gap-3 md:grid-cols-4">
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <select
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(project.id)}
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
                    <div className="text-sm font-medium text-white">
                      {project.name}
                    </div>
                    <div className="text-xs text-white/50">
                      {project.description || "—"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">
                      {project.status ?? "Active"}
                    </span>
                    <button
                      onClick={() => startEdit(project)}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
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
