"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type Project = {
  id: string;
  name: string;
  status: string | null;
  owner: string | null;
  created_at: string;
};

export default function ProjectsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      loadProjects();
    }
  }, [session]);

  const handleAdd = async () => {
    if (!session || !name.trim()) return;
    await supabase.from("projects").insert({
      user_id: session.user.id,
      name: name.trim(),
      status,
      owner: owner.trim() || null,
    });
    setName("");
    setOwner("");
    await loadProjects();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-sm text-neutral-500">All active and planned work.</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm"
            placeholder="Owner (optional)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
          <select
            className="rounded-md border border-neutral-200 px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Active</option>
            <option>Planning</option>
            <option>Paused</option>
            <option>Done</option>
          </select>
          <button
            onClick={handleAdd}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm text-white"
          >
            Add project
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white">
        <div className="grid grid-cols-3 border-b border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500">
          <div>Project</div>
          <div>Status</div>
          <div>Owner</div>
        </div>
        {loading ? (
          <div className="px-4 py-6 text-sm text-neutral-500">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="px-4 py-6 text-sm text-neutral-500">
            No projects yet.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-3 border-b border-neutral-100 px-4 py-3 text-sm"
            >
              <div>{project.name}</div>
              <div>{project.status}</div>
              <div>{project.owner || "—"}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
