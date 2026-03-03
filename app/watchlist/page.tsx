import { cookies } from "next/headers";
import MovieCard from "@/app/components/MovieCard";
import RenderModeCard from "@/app/components/RenderModeCard";
import { getMoviesByIds } from "@/app/genres/tmdb";
import { WATCHLIST_COOKIE_KEY, parseWatchlistCookieValue } from "@/app/lib/watchlist-shared";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const generatedAtIso = new Date().toISOString();
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing TMDB_ACCESS_TOKEN in environment variables.");
  }

  const watchlistCookie = (await cookies()).get(WATCHLIST_COOKIE_KEY)?.value;
  const watchlistIds = parseWatchlistCookieValue(watchlistCookie);
  const movies = await getMoviesByIds(accessToken, watchlistIds);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Watchlist
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Movies saved in your watchlist cookie.
            </p>
          </div>
          <RenderModeCard
            mode="SSR"
            modeIcon="ssr"
            modeFullName="Server-Side Rendering"
            modeDescription="Rendered on each request."
            generatedAtIso={generatedAtIso}
          />
        </header>

        {movies.length === 0 ? (
          <p className="mt-8 text-zinc-400">
            Your watchlist is empty. Tap the heart on a movie card to add one.
          </p>
        ) : (
          <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movieId={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                backdropPath={movie.backdropPath}
                voteAverage={movie.voteAverage}
                releaseDate={movie.releaseDate}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
