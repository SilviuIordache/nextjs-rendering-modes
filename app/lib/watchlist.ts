"use client";

import { useMemo, useSyncExternalStore } from "react";

export const WATCHLIST_STORAGE_KEY = "watchlist_movie_ids";
export const WATCHLIST_UPDATED_EVENT = "watchlist:updated";

function parseWatchlistRaw(raw: string): number[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => typeof value === "number");
  } catch {
    return [];
  }
}

function getWatchlistSnapshot() {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(WATCHLIST_STORAGE_KEY) ?? "[]";
}

function subscribeToWatchlistStore(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  window.addEventListener(WATCHLIST_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(WATCHLIST_UPDATED_EVENT, callback);
  };
}

export function useWatchlistMovieIds() {
  const raw = useSyncExternalStore(
    subscribeToWatchlistStore,
    getWatchlistSnapshot,
    () => "[]",
  );

  return useMemo(() => parseWatchlistRaw(raw), [raw]);
}

export function useWatchlistCount() {
  return useWatchlistMovieIds().length;
}

export function toggleWatchlistMovie(movieId: number) {
  if (typeof window === "undefined") return;

  const ids = new Set(parseWatchlistRaw(getWatchlistSnapshot()));

  if (ids.has(movieId)) {
    ids.delete(movieId);
  } else {
    ids.add(movieId);
  }

  window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new CustomEvent(WATCHLIST_UPDATED_EVENT));
}
