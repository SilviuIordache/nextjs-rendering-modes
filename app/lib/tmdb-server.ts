const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type QueryValue = string | number | boolean | null | undefined;

type TmdbGetJsonArgs = {
  accessToken: string;
  path: string;
  query?: Record<string, QueryValue>;
};

function buildTmdbUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${TMDB_BASE_URL}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function tmdbGetJson<T>({
  accessToken,
  path,
  query,
}: TmdbGetJsonArgs): Promise<T> {
  const res = await fetch(buildTmdbUrl(path, query), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed with status ${res.status}.`);
  }

  return (await res.json()) as T;
}
