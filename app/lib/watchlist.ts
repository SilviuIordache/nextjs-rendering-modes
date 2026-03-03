"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  WATCHLIST_COOKIE_KEY,
  parseWatchlistCookieValue,
  serializeWatchlistCookieValue,
} from "@/app/lib/watchlist-shared";

export const WATCHLIST_UPDATED_EVENT = "watchlist:updated";

function getWatchlistCookieRaw() {
  if (typeof document === "undefined") return "";
  const cookieParts = document.cookie.split("; ");
  const cookieEntry = cookieParts.find((part) =>
    part.startsWith(`${WATCHLIST_COOKIE_KEY}=`),
  );
  if (!cookieEntry) return "";
  return cookieEntry.slice(`${WATCHLIST_COOKIE_KEY}=`.length);
}

function getWatchlistSnapshot() {
  return getWatchlistCookieRaw();
}

function subscribeToWatchlistStore(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(WATCHLIST_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener(WATCHLIST_UPDATED_EVENT, callback);
  };
}

export function useWatchlistMovieIds() {
  const raw = useSyncExternalStore(
    subscribeToWatchlistStore,
    getWatchlistSnapshot,
    () => "",
  );

  return useMemo(() => parseWatchlistCookieValue(raw), [raw]);
}

export function useWatchlistCount() {
  return useWatchlistMovieIds().length;
}

export function toggleWatchlistMovie(movieId: number) {
  if (typeof window === "undefined") return;

  const ids = new Set(parseWatchlistCookieValue(getWatchlistSnapshot()));

  if (ids.has(movieId)) {
    ids.delete(movieId);
  } else {
    ids.add(movieId);
  }

  document.cookie = `${WATCHLIST_COOKIE_KEY}=${serializeWatchlistCookieValue([...ids])}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new CustomEvent(WATCHLIST_UPDATED_EVENT));
}
