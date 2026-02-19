import Link from "next/link";

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

type GenreWithBackdrop = Genre & {
  backdrop: string | null;
};

type GenreWithBackdropCandidates = Genre & {
  backdropCandidates: string[];
};

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";
const MAX_BACKDROP_CANDIDATES = 12;

export const dynamic = "force-static";

function GenreCard({ name, backdrop }: { name: string; backdrop: string | null }) {
  const backdropUrl = backdrop ? `${TMDB_IMAGE_BASE_URL}${backdrop}` : null;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/15 dark:bg-zinc-900">
      {backdropUrl ? (
        <div
          className="h-36 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      ) : (
        <div className="h-36 w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
      )}
      <div className="p-5">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {name}
        </h2>
      </div>
    </article>
  );
}

export default async function GenresPage() {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing TMDB_ACCESS_TOKEN in environment variables.");
  }

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
  const genresWithImages: GenreWithBackdrop[] = genresWithBackdropCandidates.map(
    (genre) => {
      const { backdropCandidates } = genre;

      if (backdropCandidates.length === 0) {
        return { id: genre.id, name: genre.name, backdrop: null };
      }

      const startIndex = genre.id % backdropCandidates.length;
      let selectedBackdrop: string | null = null;

      for (let i = 0; i < backdropCandidates.length; i += 1) {
        const candidate =
          backdropCandidates[(startIndex + i) % backdropCandidates.length];
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
    },
  );

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Browse by Genre
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Pick a genre to continue to its page.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genresWithImages.map((genre) => (
            <Link key={genre.id} href={`/genres/${genre.id}`} className="block">
              <GenreCard name={genre.name} backdrop={genre.backdrop} />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
