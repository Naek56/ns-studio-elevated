import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { callApi } from "@/lib/api";
import type { KairosClient, KairosMessage } from "@/lib/types";
import ReportMarkdown from "@/components/ReportMarkdown";

type ChatMessage = Pick<KairosMessage, "role" | "content"> & { id?: string };

export default function ChatTab({ client }: { client: KairosClient }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await callApi<{ messages: KairosMessage[] }>("chat", "history", {
          clientId: client.client_id,
        });
        setMessages(data.messages || []);
      } catch {
        /* ignore */
      }
    })();
  }, [client.client_id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setError("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);

    try {
      const data = await callApi<{ reply: string }>("chat", "send", {
        clientId: client.client_id,
        message: text,
      });
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col px-6">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto py-8">
        {messages.length === 0 && !sending && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="font-display text-3xl font-light text-white">Discutez avec Kairos</p>
            <p className="mt-3 max-w-md font-mono text-sm text-kairos-muted">
              Kairos connaît {client.nom} : ses 3 derniers rapports, ses données des 7
              derniers jours et son profil. Posez votre question.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={m.id || i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-3 text-sm",
                m.role === "user"
                  ? "bg-kairos-accent text-black"
                  : "border border-kairos-border bg-kairos-panel text-kairos-text"
              )}
            >
              {m.role === "user" ? (
                <span className="whitespace-pre-wrap font-mono">{m.content}</span>
              ) : (
                <ReportMarkdown content={m.content} />
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg border border-kairos-border bg-kairos-panel px-4 py-3 font-mono text-sm text-kairos-muted">
              <Loader2 size={14} className="animate-spin" /> Kairos réfléchit…
            </div>
          </div>
        )}
      </div>

      {error && <p className="pb-2 font-mono text-xs text-kairos-red">{error}</p>}

      <form onSubmit={send} className="border-t border-kairos-border py-4">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e);
              }
            }}
            rows={1}
            placeholder="Posez une question sur ce client…"
            className="max-h-40 flex-1 resize-none rounded-md border border-kairos-border bg-kairos-bg px-4 py-3 font-mono text-sm text-kairos-text outline-none transition focus:border-kairos-accent"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-kairos-accent text-black transition hover:bg-kairos-accent-dim disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}
