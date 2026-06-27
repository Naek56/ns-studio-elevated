import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { callApi, clearToken } from "@/lib/api";
import type { KairosClientWithStatus } from "@/lib/types";
import NewClientModal from "@/components/NewClientModal";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clients, setClients] = useState<KairosClientWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await callApi<{ clients: KairosClientWithStatus[] }>(
        "clients",
        "list"
      );
      setClients(data.clients || []);
    } catch {
      /* l'erreur 401 redirige déjà */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  const activeId = location.pathname.startsWith("/dashboard/")
    ? location.pathname.split("/")[2]
    : null;

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-kairos-border bg-kairos-panel">
      <div className="border-b border-kairos-border px-6 py-6">
        <Link to="/dashboard" className="block">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-kairos-muted">
            WAY Agency
          </p>
          <p className="mt-1 font-display text-3xl font-light leading-none text-white">
            Kairos
          </p>
        </Link>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-kairos-accent/40 bg-kairos-accent/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-kairos-accent transition hover:bg-kairos-accent/20"
        >
          <Plus size={15} /> Nouveau client
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-3 pb-2 pt-2 font-mono text-[10px] uppercase tracking-widest text-kairos-muted">
          Clients
        </p>
        {loading ? (
          <div className="flex items-center gap-2 px-3 py-3 font-mono text-xs text-kairos-muted">
            <Loader2 size={14} className="animate-spin" /> Chargement…
          </div>
        ) : clients.length === 0 ? (
          <p className="px-3 py-3 font-mono text-xs text-kairos-muted">
            Aucun client pour l'instant.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {clients.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/dashboard/${c.client_id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-sm transition",
                    activeId === c.client_id
                      ? "bg-kairos-elevated text-white"
                      : "text-kairos-text/80 hover:bg-kairos-elevated/60"
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      c.active ? "bg-kairos-green" : "bg-kairos-red"
                    )}
                    title={c.active ? "Actif" : "Inactif"}
                  />
                  <span className="truncate">{c.nom}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="flex items-center justify-between border-t border-kairos-border px-6 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-kairos-border font-mono text-xs text-kairos-text">
          NS
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-kairos-muted transition hover:text-kairos-text"
        >
          <LogOut size={13} /> Quitter
        </button>
      </div>

      {modalOpen && (
        <NewClientModal
          onClose={() => setModalOpen(false)}
          onCreated={(clientId) => {
            setModalOpen(false);
            load();
            navigate(`/dashboard/${clientId}`);
          }}
        />
      )}
    </aside>
  );
}
