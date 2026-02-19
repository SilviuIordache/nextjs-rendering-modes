import MovieCard from "@/app/components/MovieCard";
import { getTrendingMovies } from "@/app/genres/tmdb";

export const revalidate = 60;

function formatGeneratedAt(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(iso));
}

export default async function TrendingPage() {
  const generatedAtIso = new Date().toISOString();
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing TMDB_ACCESS_TOKEN in environment variables.");
  }

  const movies = await getTrendingMovies(accessToken);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Trending Movies
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              ISR demo: this page revalidates every 60 seconds.
            </p>
          </div>
          <aside className="rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm dark:border-white/15 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              ISR
            </p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
              Generated at: {formatGeneratedAt(generatedAtIso)} UTC
            </p>
          </aside>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              posterPath={movie.posterPath}
              backdropPath={movie.backdropPath}
              voteAverage={movie.voteAverage}
              releaseDate={movie.releaseDate}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
