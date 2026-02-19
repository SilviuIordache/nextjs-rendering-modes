export type GenreWithBackdrop = {
  id: number;
  name: string;
  backdrop: string | null;
};

type Genre = {
  id: number;
  name: string;
};

type GenreResponse = {
  genres: Genre[];
};

type DiscoverResponse = {
  results: Array<{
    backdrop_path: string | null;
  }>;
};

type GenreWithBackdropCandidates = Genre & {
  backdropCandidates: string[];
};

const MAX_BACKDROP_CANDIDATES = 12;

export async function getGenresWithBackdrops(
  accessToken: string,
): Promise<GenreWithBackdrop[]> {
  const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed with status ${res.status}.`);
  }

  const { genres } = (await res.json()) as GenreResponse;

  const genresWithBackdropCandidates: GenreWithBackdropCandidates[] = await Promise.all(
    genres.map(async (genre) => {
      try {
        const discoverRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${genre.id}&sort_by=popularity.desc&page=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!discoverRes.ok) {
          return { ...genre, backdropCandidates: [] };
        }

        const { results } = (await discoverRes.json()) as DiscoverResponse;
        const backdropCandidates = [
          ...new Set(
            results
              .map((movie) => movie.backdrop_path)
              .filter((backdrop): backdrop is string => Boolean(backdrop)),
          ),
        ].slice(0, MAX_BACKDROP_CANDIDATES);

        return {
          ...genre,
          backdropCandidates,
        };
      } catch {
        return { ...genre, backdropCandidates: [] };
      }
    }),
  );

  const usedBackdrops = new Set<string>();

  return genresWithBackdropCandidates.map((genre) => {
    const { backdropCandidates } = genre;

    if (backdropCandidates.length === 0) {
      return { id: genre.id, name: genre.name, backdrop: null };
    }

    const startIndex = genre.id % backdropCandidates.length;
    let selectedBackdrop: string | null = null;

    for (let i = 0; i < backdropCandidates.length; i += 1) {
      const candidate = backdropCandidates[(startIndex + i) % backdropCandidates.length];
      if (!usedBackdrops.has(candidate)) {
        usedBackdrops.add(candidate);
        selectedBackdrop = candidate;
        break;
      }
    }

    return {
      id: genre.id,
      name: genre.name,
      backdrop: selectedBackdrop ?? backdropCandidates[0] ?? null,
    };
  });
}
