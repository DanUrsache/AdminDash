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
    if (!supabase || !session || !title.trim()) return;
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
        <h1 className="text-2xl font-semibold text-white">Ideas</h1>
        <p className="text-sm text-white/60">Capture and track ideas.</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#12131a] p-4">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="New idea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-black"
          >
            Add
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#12131a] p-4">
        {loading ? (
          <div className="text-sm text-white/60">Loading…</div>
        ) : ideas.length === 0 ? (
          <div className="text-sm text-white/60">No ideas yet.</div>
        ) : (
          <ul className="space-y-2 text-sm">
            {ideas.map((idea) => (
              <li key={idea.id} className="rounded-md border border-white/10 p-2 text-white/80">
                {idea.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
