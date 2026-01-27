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
    if (!supabase || !session || !name.trim()) return;
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
            placeholder="Owner (optional)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
          <select
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
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
            className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-black"
          >
            Add project
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#12131a]">
        <div className="grid grid-cols-3 border-b border-white/10 px-4 py-2 text-xs font-semibold text-white/50">
          <div>Project</div>
          <div>Status</div>
          <div>Owner</div>
        </div>
        {loading ? (
          <div className="px-4 py-6 text-sm text-white/60">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="px-4 py-6 text-sm text-white/60">
            No projects yet.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-3 border-b border-white/5 px-4 py-3 text-sm text-white/80"
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
