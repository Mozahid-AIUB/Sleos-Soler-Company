"use client";

import { useSyncExternalStore } from "react";

/** Minimal persisted cart store — no server, no extra dependency. */

export type CartLine = { slug: string; qty: number };
type CartState = { lines: CartLine[]; open: boolean };

const KEY = "osleos-cart-v1";
const EMPTY: CartState = { lines: [], open: false };

let state: CartState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { lines: JSON.parse(raw) as CartLine[], open: false };
  } catch {
    /* storage unavailable — keep an in-memory cart */
  }
}

function set(next: CartState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next.lines));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      hydrated = false;
      hydrate();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  hydrate();
  return state;
};
const getServerSnapshot = () => EMPTY;

export const useCart = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export const cart = {
  add(slug: string, qty = 1, open = true) {
    const existing = state.lines.find((l) => l.slug === slug);
    const lines = existing
      ? state.lines.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l))
      : [...state.lines, { slug, qty }];
    set({ lines, open });
  },
  setQty(slug: string, qty: number) {
    const lines =
      qty <= 0 ? state.lines.filter((l) => l.slug !== slug) : state.lines.map((l) => (l.slug === slug ? { ...l, qty } : l));
    set({ ...state, lines });
  },
  remove(slug: string) {
    set({ ...state, lines: state.lines.filter((l) => l.slug !== slug) });
  },
  clear() {
    set({ lines: [], open: false });
  },
  open() {
    set({ ...state, open: true });
  },
  close() {
    set({ ...state, open: false });
  },
};
