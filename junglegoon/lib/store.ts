"use client";

import { useCallback, useEffect, useState } from "react";

// localStorage persistence for the two things that are truly *yours*:
// the product watchlist and the idea vault. Single-user tool, no backend.

export type IdeaStatus = "spark" | "researching" | "validated" | "shelved";

export type Idea = {
  id: string;
  title: string;
  source: string; // e.g. "Trend Radar: bird feeder camera" or "manual"
  notes: string;
  status: IdeaStatus;
  createdAt: string;
  nicheId?: string;
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("jg-store", { detail: key }));
  } catch {
    // storage full/blocked — non-fatal for a research tool
  }
}

/** React state mirrored into localStorage, synced across components. */
export function useStored<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(read(key, fallback));
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(read(key, fallback));
    };
    window.addEventListener("jg-store", onChange);
    return () => window.removeEventListener("jg-store", onChange);
    // fallback is intentionally not a dep — it's a constant per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        write(key, next);
        return next;
      });
    },
    [key]
  );

  return [value, set];
}

export const TRACKED_KEY = "jg:tracked-asins";
export const IDEAS_KEY = "jg:ideas";

export function useTracked(): [string[], (asin: string) => void] {
  const [tracked, setTracked] = useStored<string[]>(TRACKED_KEY, []);
  const toggle = useCallback(
    (asin: string) =>
      setTracked((prev) =>
        prev.includes(asin) ? prev.filter((a) => a !== asin) : [...prev, asin]
      ),
    [setTracked]
  );
  return [tracked, toggle];
}

export function useIdeas() {
  const [ideas, setIdeas] = useStored<Idea[]>(IDEAS_KEY, []);

  const addIdea = useCallback(
    (partial: Omit<Idea, "id" | "createdAt" | "status"> & { status?: IdeaStatus }) => {
      const idea: Idea = {
        id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        status: partial.status ?? "spark",
        ...partial,
      };
      setIdeas((prev) => [idea, ...prev]);
      return idea;
    },
    [setIdeas]
  );

  const updateIdea = useCallback(
    (id: string, patch: Partial<Idea>) =>
      setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i))),
    [setIdeas]
  );

  const removeIdea = useCallback(
    (id: string) => setIdeas((prev) => prev.filter((i) => i.id !== id)),
    [setIdeas]
  );

  return { ideas, addIdea, updateIdea, removeIdea };
}
