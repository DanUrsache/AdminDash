"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type Idea = {
  id: string;
  title: string;
  created_at: string;
};

export default function IdeasPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });
    setIdeas(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      loadIdeas();
    }
  }, [session]);

  const handleAdd = async () => {
    if (!session || !title.trim()) return;
    await supabase.from("ideas").insert({
      user_id: session.user.id,
      title: title.trim(),
    });
    setTitle("");
    await loadIdeas();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ideas</h1>
        <p className="text-sm text-neutral-500">Capture and track ideas.</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-md border border-neutral-200 px-3 py-2 text-sm"
            placeholder="New idea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm text-white"
          >
            Add
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        {loading ? (
          <div className="text-sm text-neutral-500">Loading…</div>
        ) : ideas.length === 0 ? (
          <div className="text-sm text-neutral-500">No ideas yet.</div>
        ) : (
          <ul className="space-y-2 text-sm">
            {ideas.map((idea) => (
              <li key={idea.id} className="rounded-md border border-neutral-100 p-2">
                {idea.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
