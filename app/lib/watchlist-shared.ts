export const WATCHLIST_COOKIE_KEY = "watchlist_movie_ids";

const MAX_WATCHLIST_IDS = 100;

export function sanitizeWatchlistIds(input: unknown): number[] {
  if (!Array.isArray(input)) return [];

  return [
    ...new Set(
      input.filter(
        (value): value is number =>
          typeof value === "number" &&
          Number.isInteger(value) &&
          value > 0 &&
          value < Number.MAX_SAFE_INTEGER,
      ),
    ),
  ].slice(0, MAX_WATCHLIST_IDS);
}

export function parseWatchlistCookieValue(raw: string | undefined): number[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
    return sanitizeWatchlistIds(parsed);
  } catch {
    return [];
  }
}

export function serializeWatchlistCookieValue(ids: number[]): string {
  return encodeURIComponent(JSON.stringify(sanitizeWatchlistIds(ids)));
}
