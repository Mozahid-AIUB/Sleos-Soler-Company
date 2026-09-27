"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { whatsappLink } from "@/content/site";
import { WhatsappIcon } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/config";
import { WHATSAPP_GREETING, type AssistantStrings } from "./types";

// The chat UI is only downloaded when a visitor actually opens it.
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

/**
 * Two separate floating actions, stacked bottom-right:
 * the AI assistant (charcoal + gold) and WhatsApp (brand green).
 */
export function AssistantWidget({ lang, t }: { lang: Locale; t: AssistantStrings }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const aiRef = useRef<HTMLButtonElement>(null);

  const openChat = () => {
    setChatLoaded(true);
    setChatOpen(true);
  };

  const closeChat = useCallback(() => {
    setChatOpen(false);
    requestAnimationFrame(() => aiRef.current?.focus());
  }, []);

  return (
    <>
      {chatLoaded && <ChatPanel lang={lang} t={t} open={chatOpen} onClose={closeChat} />}

      <div
        // Hidden (not unmounted) while the chat is open so the entrance animation doesn't replay.
        inert={chatOpen}
        aria-hidden={chatOpen || undefined}
        className={`hero-in fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 [animation-delay:1.2s] md:bottom-7 md:right-7 ${
          chatOpen ? "invisible" : ""
        }`}
      >
        <FloatingAction label={t.aiTitle}>
          <button
            ref={aiRef}
            type="button"
            onClick={openChat}
            onPointerEnter={() => void loadPanel()}
            onFocus={() => void loadPanel()}
            aria-label={t.aiTitle}
            className="fab bg-gold-500 text-forest-950 ring-1 ring-black/10 hover:bg-gold-400"
          >
            <SparkleIcon />
          </button>
        </FloatingAction>

        <FloatingAction label={t.waTitle}>
          <a
            href={whatsappLink(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.waTitle}
            className="fab bg-[#25d366] text-white ring-1 ring-black/5 hover:bg-[#20bd5b]"
          >
            <WhatsappIcon size={26} />
          </a>
        </FloatingAction>
      </div>
    </>
  );
}

/** Wraps a round action with a label that slides out on hover/focus (pointer devices). */
function FloatingAction({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="group/fab relative flex items-center">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-md bg-forest-950 px-3 py-1.5 text-[13px] font-medium text-white opacity-0 shadow-lg transition-all duration-300 ease-out-expo group-focus-within/fab:translate-x-0 group-focus-within/fab:opacity-100 group-hover/fab:translate-x-0 group-hover/fab:opacity-100 [@media(hover:hover)]:block"
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11 3.5c.3 3.9 2.6 6.2 6.5 6.5-3.9.3-6.2 2.6-6.5 6.5-.3-3.9-2.6-6.2-6.5-6.5 3.9-.3 6.2-2.6 6.5-6.5z" />
      <path d="M18.2 14.5c.15 1.9 1.1 2.85 3 3-1.9.15-2.85 1.1-3 3-.15-1.9-1.1-2.85-3-3 1.9-.15 2.85-1.1 3-3z" opacity=".8" />
    </svg>
  );
}
