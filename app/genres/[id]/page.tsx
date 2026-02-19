import Link from "next/link";
import { notFound } from "next/navigation";
import GeneratedAtCard from "@/app/components/GeneratedAtCard";
import MovieCard from "@/app/components/MovieCard";
import { getMovieGenres, getMoviesByGenre } from "../tmdb";

type GenrePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing TMDB_ACCESS_TOKEN in environment variables.");
  }

  const genres = await getMovieGenres(accessToken);

  return genres.map((genre) => ({ id: String(genre.id) }));
}

export default async function GenrePage({ params }: GenrePageProps) {
  const generatedAtIso = new Date().toISOString();
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing TMDB_ACCESS_TOKEN in environment variables.");
  }

  const { id } = await params;
  const genreId = Number(id);

  if (!Number.isInteger(genreId)) {
    notFound();
  }

  const [genres, movies] = await Promise.all([
    getMovieGenres(accessToken),
    getMoviesByGenre(accessToken, genreId),
  ]);

  const genre = genres.find((entry) => entry.id === genreId);

  if (!genre) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/genres"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Back to genres
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {genre.name} Movies
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Popular titles in this genre.
            </p>
          </div>
          <GeneratedAtCard
            mode="SSG"
            generatedAtIso={generatedAtIso}
            showRelative
          />
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
