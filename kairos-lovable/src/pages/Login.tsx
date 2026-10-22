import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Accès refusé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-kairos-bg px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.45em] text-kairos-muted">
            WAY Agency
          </p>
          <h1 className="mt-3 font-display text-6xl font-light text-white">Kairos</h1>
          <p className="mt-2 font-mono text-xs text-kairos-muted">
            Système privé — accès restreint
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-kairos-muted">
              Mot de passe maître
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-kairos-border bg-kairos-surface px-4 py-3 font-mono text-sm text-kairos-text outline-none transition focus:border-kairos-accent"
              placeholder="••••••••••"
            />
          </div>

          {error && <p className="font-mono text-xs text-kairos-red">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-md bg-kairos-accent px-4 py-3 font-mono text-sm font-medium text-black transition hover:bg-kairos-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Vérification…" : "Entrer"}
          </button>
        </form>

        <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-kairos-muted/60">
          NS
        </p>
      </div>
    </main>
  );
}
