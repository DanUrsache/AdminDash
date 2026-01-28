"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type Idea = {
  id: string;
  title: string;
  notes: string | null;
  created_at: string;
};

export default function IdeasPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadIdeas = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setIdeas([]);
    } else {
      setIdeas(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      loadIdeas();
    }
  }, [session]);

  const handleAdd = async () => {
    if (!supabase || !session || !title.trim()) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("ideas").insert({
      user_id: session.user.id,
      title: title.trim(),
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTitle("");
    setNotes("");
    await loadIdeas();
  };

  const startEdit = (idea: Idea) => {
    setEditingId(idea.id);
    setEditTitle(idea.title);
    setEditNotes(idea.notes ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditNotes("");
  };

  const saveEdit = async (id: string) => {
    if (!supabase || !session || !editTitle.trim()) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("ideas")
      .update({ title: editTitle.trim(), notes: editNotes.trim() || null })
      .eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    cancelEdit();
    await loadIdeas();
  };

  const deleteIdea = async (id: string) => {
    if (!supabase || !session) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("ideas").delete().eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await loadIdeas();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Ideas</h1>
        <p className="text-sm text-white/60">Capture and track ideas.</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#12131a] p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="New idea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-black disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add"}
          </button>
        </div>
        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-white/60">Loading…</div>
        ) : ideas.length === 0 ? (
          <div className="text-sm text-white/60">No ideas yet.</div>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-lg border border-white/10 bg-[#12131a] p-4 text-white/80"
            >
              {editingId === idea.id ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(idea.id)}
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
                      {idea.title}
                    </div>
                    <div className="text-xs text-white/50">
                      {idea.notes || "—"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(idea)}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteIdea(idea.id)}
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
