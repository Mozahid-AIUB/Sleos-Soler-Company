"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { whatsappLink } from "@/content/site";
import { Icon, WhatsappIcon } from "@/components/ui/Icon";
import { WHATSAPP_GREETING, type ChatPanelProps } from "./types";

type Role = "user" | "assistant";
type Notice = "unavailable" | "error" | "rateLimited" | "tooLong";
type Message = { id: number; role: Role; content: string; notice?: Notice };

const MAX_CHARS = 1000;
const HISTORY = 10;
const STORAGE_KEY = "osleos-assistant-v1";

let nextId = 1;
const msg = (role: Role, content: string, notice?: Notice): Message => ({ id: nextId++, role, content, notice });

function loadHistory(): Message[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { role: Role; content: string }[];
    return parsed.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").map((m) => msg(m.role, m.content));
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  try {
    const plain = messages.filter((m) => !m.notice && m.content).map(({ role, content }) => ({ role, content }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plain.slice(-20)));
  } catch {
    /* storage unavailable — chat still works, it just won't survive a reload */
  }
}

/** Plain-text reply -> text with clickable site paths and URLs. */
function renderText(text: string, lang: string): ReactNode[] {
  const clean = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\{lang\}/g, lang);
  const parts = clean.split(/((?:https?:\/\/[^\s)]+)|(?:\/(?:en|bn)(?:\/[\w-]+)*\/?))/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.replace(/[.,;:]+$/, "");
    const tail = part.slice(href.length);
    const cls = "font-semibold text-teal-600 underline decoration-gold-500/60 underline-offset-2 hover:decoration-gold-500";
    return (
      <span key={i}>
        {href.startsWith("/") ? (
          <Link href={href} className={cls}>
            {href}
          </Link>
        ) : (
          <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {href.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        )}
        {tail}
      </span>
    );
  });
}

export default function ChatPanel({ lang, t, open, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const titleId = useId();

  // Restore the conversation from this browser tab (survives reloads / language switch).
  useEffect(() => {
    const restored = loadHistory();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from sessionStorage
    if (restored.length) setMessages(restored);
  }, []);

  useEffect(() => {
    if (!busy) saveHistory(messages);
  }, [messages, busy]);

  // Entrance transition + focus the input when opened.
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset transition state when hidden
      setShown(false);
      return;
    }
    const raf = requestAnimationFrame(() => {
      setShown(true);
      inputRef.current?.focus({ preventScroll: true });
    });
    // Esc closes even when focus has dropped to <body> (e.g. a clicked starter chip unmounted).
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const userQuestions = messages.filter((m) => m.role === "user").map((m) => m.content);
  const handoffHref = whatsappLink(
    userQuestions.length
      ? `${t.waSummaryIntro}\n${userQuestions
          .slice(-5)
          .map((q) => `- ${q.length > 200 ? `${q.slice(0, 200)}…` : q}`)
          .join("\n")}`
      : WHATSAPP_GREETING,
  );

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;
      if (question.length > MAX_CHARS) {
        setMessages((m) => [...m, msg("assistant", t.tooLong, "tooLong")]);
        return;
      }

      const user = msg("user", question);
      const history = [...messages.filter((m) => !m.notice && m.content), user]
        .slice(-HISTORY)
        .map(({ role, content }) => ({ role, content }));
      const reply = msg("assistant", "");
      setMessages((m) => [...m, user, reply]);
      setInput("");
      setBusy(true);
      inputRef.current?.focus({ preventScroll: true });

      const update = (content: string, notice?: Notice) =>
        setMessages((m) => m.map((x) => (x.id === reply.id ? { ...x, content, notice } : x)));

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, lang }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const notice: Notice =
            res.status === 503 ? "unavailable" : res.status === 429 ? "rateLimited" : res.status === 413 ? "tooLong" : "error";
          update(t[notice], notice);
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          update(acc);
        }
        acc += decoder.decode();
        if (!acc.trim()) update(t.error, "error");
        else update(acc);
      } catch {
        if (!controller.signal.aborted) update(t.error, "error");
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setBusy(false);
      }
    },
    [busy, messages, lang, t],
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    inputRef.current?.focus();
  };

  // Light focus trap + Esc to close.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const lastIsPending = busy && messages[messages.length - 1]?.content === "";

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      hidden={!open}
      onKeyDown={onKeyDown}
      className={`fixed inset-0 z-50 flex h-dvh flex-col bg-white transition-[opacity,transform] duration-300 ease-out md:inset-auto md:bottom-7 md:right-7 md:h-[min(640px,calc(100dvh-3.5rem))] md:w-95 md:overflow-hidden md:rounded-lg md:shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)] md:ring-1 md:ring-black/10 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gold-500/25 bg-forest-900 px-4 py-3.5 text-white">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-800 text-gold-400 ring-1 ring-gold-500/30">
          <Icon name="sun" size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="truncate text-[15px] font-semibold leading-tight">
            {t.panelTitle}
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
            {t.panelSub}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            aria-label={t.reset}
            title={t.reset}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon name="plus" size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-cream-50 px-4 py-5"
        aria-live="polite"
        aria-busy={busy}
      >
        <Bubble role="assistant" label={t.bot}>
          {t.greeting}
        </Bubble>

        {messages.length === 0 && (
          <div className="pt-1">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">{t.startersLabel}</p>
            <div className="flex flex-col items-start gap-2">
              {t.starters.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-lg border border-cream-200 bg-white px-3 py-2 text-left text-[13px] leading-snug text-ink-900 transition-colors hover:border-gold-500 hover:bg-gold-300/15"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.content === "" ? null : m.notice ? (
            <div key={m.id} role="status" className="rounded-lg border border-gold-500/40 bg-white p-3.5 text-[13.5px] leading-relaxed text-ink-900">
              <p>{m.content}</p>
              {(m.notice === "unavailable" || m.notice === "error") && (
                <a
                  href={handoffHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <WhatsappIcon size={16} />
                  {t.waTitle}
                </a>
              )}
            </div>
          ) : (
            <Bubble key={m.id} role={m.role} label={m.role === "user" ? t.you : t.bot}>
              {m.role === "assistant" ? renderText(m.content, lang) : m.content}
            </Bubble>
          ),
        )}

        {lastIsPending && (
          <div className="flex items-center gap-1.5 px-1 py-2" role="status" aria-label={t.typing}>
            {[0, 150, 300].map((d) => (
              <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-400" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-cream-200 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
        <a
          href={handoffHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2.5 flex items-center justify-center gap-2 rounded-lg border border-cream-200 px-3 py-2 text-[13px] font-semibold text-forest-900 transition-colors hover:border-[#25d366] hover:bg-[#25d366]/5"
        >
          <WhatsappIcon size={16} className="text-[#1faa55]" />
          {t.handoff}
        </a>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2"
        >
          <label htmlFor={`${titleId}-input`} className="sr-only">
            {t.placeholder}
          </label>
          <textarea
            id={`${titleId}-input`}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={MAX_CHARS}
            placeholder={t.placeholder}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-lg border border-cream-200 bg-cream-50 px-3.5 py-2.5 text-[14px] leading-snug text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:bg-white focus:outline-none field-sizing-content"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label={t.send}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-forest-950 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:bg-cream-200 disabled:text-ink-400"
          >
            <Icon name="arrowRight" size={20} strokeWidth={2} />
          </button>
        </form>
        <p className="mt-2 px-1 text-[11px] leading-snug text-ink-400">{t.disclaimer}</p>
      </div>
    </div>
  );
}

function Bubble({ role, label, children }: { role: Role; label: string; children: ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap wrap-break-word rounded-lg px-3.5 py-2.5 text-[14px] leading-relaxed ${
          mine ? "bg-forest-900 text-white" : "border border-cream-200 bg-white text-ink-900"
        }`}
      >
        <span className="sr-only">{label}: </span>
        {children}
      </div>
    </div>
  );
}
