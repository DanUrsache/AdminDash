"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, hasSupabaseConfig } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center">
      <div className="rounded-lg border border-white/10 bg-[#12131a] p-6 text-white">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-white/60">
          Use your email and password.
        </p>

        {!hasSupabaseConfig ? (
          <div className="mt-4 rounded-md bg-amber-500/10 p-3 text-xs text-amber-200">
            Supabase env vars are missing on this deployment.
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs text-white/60">Email</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Password</label>
            <input
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--primary)] px-3 py-2 text-sm text-black disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
