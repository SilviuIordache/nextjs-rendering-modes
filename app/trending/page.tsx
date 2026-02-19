import GeneratedAtCard from "@/app/components/GeneratedAtCard";
import MovieCard from "@/app/components/MovieCard";
import { getTrendingMovies } from "@/app/genres/tmdb";

export const revalidate = 60;

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
          <GeneratedAtCard mode="ISR" generatedAtIso={generatedAtIso} />
        </header>

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
      </div>
    </main>
  );
}
